import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import type { JobStatus, JobFormData } from '../types';
import { addJob, updateJob, setSelectedJob } from '../features/jobs/jobSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface JobFormProps {
  onClose: () => void;
}

const initialFormData: JobFormData = {
  company: '',
  position: '',
  jobLink: '',
  status: 'Saved',
  notes: '',
};

const statusOptions: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const JobForm: React.FC<JobFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob);
  
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  useEffect(() => {
    if (selectedJob) {
      setFormData({
        company: selectedJob.company,
        position: selectedJob.position,
        jobLink: selectedJob.jobLink,
        status: selectedJob.status,
        notes: selectedJob.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedJob]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.jobLink.trim()) {
      newErrors.jobLink = 'Job link is required';
    } else if (!isValidUrl(formData.jobLink)) {
      newErrors.jobLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (selectedJob) {
      dispatch(updateJob({
        id: selectedJob.id,
        updates: formData,
      }));
      toast.success('Job updated successfully');
    } else {
      dispatch(addJob({
        ...formData,
        dateApplied: formData.status === 'Applied' ? new Date().toISOString() : '',
      }));
      toast.success('Job added successfully');
    }

    dispatch(setSelectedJob(null));
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof JobFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedJob ? 'Edit Job' : 'Add New Job'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors.company && (
              <p className="mt-1 text-xs text-red-600">{errors.company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.position ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter job position"
            />
            {errors.position && (
              <p className="mt-1 text-xs text-red-600">{errors.position}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Link *
            </label>
            <input
              type="url"
              name="jobLink"
              value={formData.jobLink}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.jobLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://..."
            />
            {errors.jobLink && (
              <p className="mt-1 text-xs text-red-600">{errors.jobLink}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about the job..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {selectedJob ? 'Update Job' : 'Add Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;