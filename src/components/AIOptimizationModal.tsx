import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { setSelectedJob } from '../features/jobs/jobSlice';
import { XMarkIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AIOptimizationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob);
  const loading = useAppSelector((state) => state.jobs.loading);

  if (!selectedJob) return null;

  const latestOptimization = selectedJob.resumeOptimizations?.[0];

  const handleClose = () => {
    dispatch(setSelectedJob(null));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI Resume Optimization for {selectedJob.position} at {selectedJob.company}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">AI is analyzing your resume...</p>
          </div>
        ) : latestOptimization ? (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">ATS Compatibility Score</span>
                <span className="text-3xl font-bold">{(selectedJob as any).atsScore || 85}%</span>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommended Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {latestOptimization.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Skills to Add</h4>
              <ul className="space-y-2">
                {latestOptimization.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Resume Improvements</h4>
              <ul className="space-y-2">
                {latestOptimization.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  // In a real app, this would download a report
                  alert('Download feature coming soon!');
                }}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download Optimization Report
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No optimizations available for this job yet.</p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOptimizationModal;