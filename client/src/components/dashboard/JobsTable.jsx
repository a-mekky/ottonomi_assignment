import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, ArrowRight } from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatDate';
import { Pagination } from '../shared/Pagination';
import { PaginationInfo } from '../shared/PaginationInfo';

/**
 * Table component showing posted jobs with application counts
 * Clickable rows navigate to candidates page
 */
export function JobsTable({ jobs, pagination, onPageChange }) {
    const navigate = useNavigate();

    if (jobs.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Jobs Posted Yet
                </h3>
                <p className="text-gray-600">
                    Start by posting your first job opening
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                    Your Posted Jobs
                </h2>
            </div>

            <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        onClick={() => navigate(`/dashboard/jobs/${job._id}/candidates`)}
                        className="px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            {/* Job Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {job.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        {job.company}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatRelativeDate(job.datePosted)}
                                    </span>
                                </div>
                            </div>

                            {/* Application Count */}
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-2xl font-bold">
                                            {job.applicationCount}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {job.applicationCount === 1 ? 'Application' : 'Applications'}
                                    </p>
                                </div>

                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Footer */}
            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <PaginationInfo
                            currentPage={pagination.currentPage}
                            itemsPerPage={pagination.itemsPerPage}
                            totalItems={pagination.totalItems}
                        />
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
