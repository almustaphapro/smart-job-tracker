export interface Job {
    id: string;
    company: string;
    position: string;
    jobLink: string;
    status: JobStatus;
    dateApplied: string;
    notes?: string;
    resumeOptimization?: ResumeOptimization[];
    createdAt: string;
    updatedAt: string;
}

export type JobStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer' | 'Saved';

export interface ResumeOptimization {
    id: string;
    suggestions: string[];
    keywords: string[];
    improvements: string[];
    createdAt: string;
}

export interface JobFormData {
    company: string;
    position: string;
    jobLink: string;
    status: JobStatus;
    notes?: string;
}

export interface AISuggestion {
    keywords: string[];
    missingSkills: string[];
    improvements: string[];
    atsScore: number;
}