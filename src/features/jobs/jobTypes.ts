import type { Job, JobFormData } from '../../types';

export interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  selectedJob: Job | null;
  filters: {
    status: string | null;
    search: string;
  };
}

export interface AddJobPayload extends JobFormData {}

export interface UpdateJobPayload {
  id: string;
  updates: Partial<JobFormData>;
}