import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Briefcase, Users, ArrowRight } from 'lucide-react';

/**
 * Compact list showing top jobs by application count
 * Shows ranking badges and application counts
 */
export function TopJobsList({ topJobs }) {
    const navigate = useNavigate();

    // Hide section if no data
    if (!topJobs || topJobs.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                        Top Jobs
                    </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Jobs with the most applications
                </p>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-200">
                {topJobs.map((job) => {
                    return (
                        <div
                            key={job._id}
                            onClick={() => navigate(`/dashboard/jobs/${job._id}/candidates`)}
                            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Job Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span className="truncate">{job.company}</span>
                                    </div>
                                </div>

                                {/* Application Count */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-gray-900">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span className="text-xl font-bold">
                                                {job.applicationCount}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {job.applicationCount === 1 ? 'applicant' : 'applicants'}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

