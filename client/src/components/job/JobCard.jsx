import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export function JobCard({ job }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">{job.company}</span>
          </div>
        </div>
        <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-xl transition-colors">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Details */}
      <div className="flex flex-wrap gap-3 mb-4">
        {job.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formatRelativeDate(job.datePosted)}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}