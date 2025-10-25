import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign } from 'lucide-react';
import { useJobDetails } from '../hooks/useJobDetails';
import { ApplicationForm } from '../components/application/ApplicationForm';
import { Loading } from '../components/shared/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage';

export function JobApply() {
    const { id } = useParams();
    const { job, loading, error, refetch } = useJobDetails(id);

    if (loading) return <Loading message="Loading job details..." />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!job) return <ErrorMessage message="Job not found" />;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
                to={`/job/${id}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Job Details</span>
            </Link>

            {/* Job Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">{job.company}</span>
                            </div>
                            {job.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                            )}
                            {job.salary && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{job.salary}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form */}
            <ApplicationForm jobId={id} />
        </div>
    );
}
