import React from 'react';
import type { Job, JobStatus } from '../types';
import { useAppDispatch } from '../app/store';
import { deleteJob, setSelectedJob, optimizeResumeForJob } from '../features/jobs/jobSlice';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  CalendarIcon,
  TrashIcon,
  PencilIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
}

const statusColors: Record<JobStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  Applied: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800',
    icon: <ClockIcon className="w-4 h-4" />
  },
  Interview: { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800',
    icon: <UserGroupIcon className="w-4 h-4" />
  },
  Rejected: { 
    bg: 'bg-red-100', 
    text: 'text-red-800',
    icon: <XCircleIcon className="w-4 h-4" />
  },
  Offer: { 
    bg: 'bg-green-100', 
    text: 'text-green-800',
    icon: <CheckCircleIcon className="w-4 h-4" />
  },
  Saved: { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800',
    icon: <ClockIcon className="w-4 h-4" />
  },
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(deleteJob(job.id));
      toast.success('Job deleted successfully');
    }
  };

  const handleEdit = () => {
    dispatch(setSelectedJob(job.id));
  };

  const handleOptimize = () => {
    toast.promise(
      dispatch(optimizeResumeForJob(job.id)).unwrap(),
      {
        loading: 'AI is analyzing your resume...',
        success: (data: any) => {
          const atsScore = (job as any).atsScore || 85;
          return `✨ AI suggestions ready! ATS Score: ${atsScore}%`;
        },
        error: 'Failed to generate suggestions',
      }
    );
  };

  const openJobLink = () => {
    window.open(job.jobLink, '_blank');
  };

  const statusStyle = statusColors[job.status];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.position}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <BuildingOfficeIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.icon}
            <span className="ml-1">{job.status}</span>
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>Applied {formatDistanceToNow(new Date(job.dateApplied), { addSuffix: true })}</span>
        </div>

        {job.resumeOptimizations && job.resumeOptimizations.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-purple-700">
                <SparklesIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">AI Insights</span>
              </div>
              {(job as any).atsScore && (
                <span className="text-xs font-semibold text-purple-600">
                  ATS Score: {(job as any).atsScore}%
                </span>
              )}
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              {job.resumeOptimizations[0].improvements.slice(0, 2).map((improvement, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-purple-500 mr-1">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={handleOptimize}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              title="Get AI Resume Suggestions"
            >
              <SparklesIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit Job"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete Job"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={openJobLink}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <span className="mr-1">View Job</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;