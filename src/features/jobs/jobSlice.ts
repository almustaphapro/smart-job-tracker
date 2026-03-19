import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Job, ResumeOptimization, JobStatus } from '../../types';
import type { JobsState, AddJobPayload, UpdateJobPayload } from './jobTypes';
import { generateAISuggestions } from '../../services/aiService';

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  selectedJob: null,
  filters: {
    status: null,
    search: '',
  },
};

// Async thunk for AI optimization
export const optimizeResumeForJob = createAsyncThunk(
  'jobs/optimizeResume',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobsState };
      const job = state.jobs.jobs.find(j => j.id === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }

      const suggestions = await generateAISuggestions(job);
      
      const optimization = {
        jobId,
        suggestions: suggestions.improvements,
        keywords: suggestions.keywords,
        improvements: suggestions.missingSkills,
      };

      return { jobId, optimization, atsScore: suggestions.atsScore };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to optimize resume');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<AddJobPayload>) => {
      const newJob: Job = {
        id: uuidv4(),
        company: action.payload.company,
        position: action.payload.position,
        jobLink: action.payload.jobLink,
        status: action.payload.status,
        dateApplied: action.payload.dateApplied || new Date().toISOString(),
        notes: action.payload.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resumeOptimizations: [],
      };
      state.jobs.unshift(newJob);
    },
    updateJob: (state, action: PayloadAction<UpdateJobPayload>) => {
      const { id, updates } = action.payload;
      const jobIndex = state.jobs.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = {
          ...state.jobs[jobIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    setSelectedJob: (state, action: PayloadAction<string | null>) => {
      const jobId = action.payload;
      state.selectedJob = jobId ? state.jobs.find(job => job.id === jobId) || null : null;
    },
    setFilterStatus: (state, action: PayloadAction<JobStatus | null>) => {
      state.filters.status = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimizeResumeForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeResumeForJob.fulfilled, (state, action) => {
        state.loading = false;
        const { jobId, optimization, atsScore } = action.payload;
        const job = state.jobs.find(j => j.id === jobId);
        if (job) {
          const newOptimization: ResumeOptimization = {
            id: uuidv4(),
            jobId: optimization.jobId,
            suggestions: optimization.suggestions,
            keywords: optimization.keywords,
            improvements: optimization.improvements,
            createdAt: new Date().toISOString(),
          };
          if (!job.resumeOptimizations) {
            job.resumeOptimizations = [];
          }
          job.resumeOptimizations.unshift(newOptimization);
          // Add ATS score to job
          (job as any).atsScore = atsScore;
        }
      })
      .addCase(optimizeResumeForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addJob,
  updateJob,
  deleteJob,
  setSelectedJob,
  setFilterStatus,
  setSearchQuery,
} = jobSlice.actions;

export default jobSlice.reducer;