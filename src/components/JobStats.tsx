import React from 'react';
import { useAppSelector } from '../app/store';
import type { JobStatus } from '../types';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const JobStats: React.FC = () => {
  const jobs = useAppSelector((state) => state.jobs.jobs);

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    offer: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
    saved: jobs.filter(j => j.status === 'Saved').length,
  };

  const averageAtsScore = jobs.reduce((acc, job) => {
    const score = (job as any).atsScore || 0;
    return acc + score;
  }, 0) / (jobs.length || 1);

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: BriefcaseIcon, color: 'bg-blue-500' },
    { label: 'Applied', value: stats.applied, icon: ClockIcon, color: 'bg-yellow-500' },
    { label: 'Interviews', value: stats.interview, icon: UserGroupIcon, color: 'bg-purple-500' },
    { label: 'Offers', value: stats.offer, icon: CheckCircleIcon, color: 'bg-green-500' },
    { label: 'Rejected', value: stats.rejected, icon: XCircleIcon, color: 'bg-red-500' },
    { label: 'Saved', value: stats.saved, icon: SparklesIcon, color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {jobs.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Average ATS Score</p>
                <p className="text-2xl font-bold">{Math.round(averageAtsScore)}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Success Rate</p>
              <p className="text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStats;