import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/store';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import JobStats from '../components/JobStats';
import AIOptimizationModal from '../components/AIOptimizationModal';
import { setFilterStatus, setSearchQuery } from '../features/jobs/jobSlice';
import type { JobStatus } from '../types';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, filters } = useAppSelector((state) => state.jobs);
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const statusFilters: (JobStatus | 'All')[] = ['All', 'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filters.status === null || filters.status === 'All' || job.status === filters.status;
    const matchesSearch = job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                          job.position.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Job Tracker</h1>
              <p className="mt-2 text-gray-600">Track your applications and optimize your resume with AI</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <JobStats />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by company or position..."
              value={filters.search}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => dispatch(setFilterStatus(status === 'All' ? null : status as JobStatus))}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  (status === 'All' && filters.status === null) || filters.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found</p>
              <p className="text-gray-400 mt-2">Add your first job to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && <JobForm onClose={() => setIsFormOpen(false)} />}
      {selectedJob && <AIOptimizationModal />}
    </div>
  );
};

export default Dashboard;