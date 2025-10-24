import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { useJobDetails } from '../hooks/useJobDetails';
import { Loading } from '../components/shared/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { formatFullDate, formatRelativeDate } from '../utils/formatDate';

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading, error, refetch } = useJobDetails(id);
  
  if (loading) return <Loading message="Loading job details..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!job) return <ErrorMessage message="Job not found" />;
  
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border-2 border-gray-100 overflow-hidden my-4 mx-auto max-w-7xl min-h-screen">
      {/* Header Section */}
      <div className="bg-linear-to-br from-blue-500 to-purple-600 p-8 text-white">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        <div className="flex items-start gap-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-white/90">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">{job.company}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-gray-50">
        {job.location && (
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-gray-900 font-semibold">{job.location}</p>
              </div>
            </div>
          </div>
        )}

        {job.salary && (
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2.5 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Salary</p>
                <p className="text-gray-900 font-semibold">{job.salary}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2.5 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Posted</p>
              <p className="text-gray-900 font-semibold">{formatRelativeDate(job.datePosted)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Job Description
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Posted Date */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Posted on {formatFullDate(job.datePosted)}
          </p>
        </div>
      </div>
    </div>
  );
}