import React from 'react';
import { useJobs } from '../hooks/useJobs';
import { JobCard } from '../components/job/JobCard';
import { Loading } from '../components/shared/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Pagination } from '../components/shared/Pagination';
import { PaginationInfo } from '../components/shared/PaginationInfo';
import { Briefcase } from 'lucide-react';

export function JobList() {
    const { jobs, loading, error, refetch, pagination } = useJobs();

    const handlePageChange = (page) => {
        refetch(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <Loading message="Loading opportunities..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="bg-gray-50 border-2 border-gray-200 border-dashed rounded-2xl p-12 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Jobs Available
                    </h3>
                    <p className="text-gray-600">
                        Check back soon for new opportunities!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <Layout> */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Find Your Dream Job
                        </h1>
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-gray-600">
                                Explore amazing opportunities waiting for you
                            </p>
                            <PaginationInfo
                                currentPage={pagination.currentPage}
                                itemsPerPage={pagination.itemsPerPage}
                                totalItems={pagination.totalItems}
                            />
                        </div>
                    </div>

                    {/* Job Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            {/* </Layout> */}
        </>
    );
}