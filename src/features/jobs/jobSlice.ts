import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResumeOptimization } from "../../types";



const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  selectedJob: null,
  filters: {
    status:null,
    search: '',
  },
};

//Async thunk for AI optimization 
export const optimizedResumeForJob = createAsyncThunk(
  'jobs/optimizeResume',
  async (jobId: string, {  getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobsState };

      if (!job) {
        throw new Error ('Job not found');
      }

      const suggestions = await generateAISuggestions(job);

      const optimization: Omit<ResumeOptimization, 'id' | 'createdAt'> =
      {
        jobId, 
        suggestions: suggestions.improvements,
        keywords: suggestions.keywords,
        improvements: suggestions.missingSkills,
      };
      return {}
    } catch (error) {}
  }
)