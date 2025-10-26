import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, MapPin, Calendar } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';
import { CandidatesList } from '../components/dashboard/CandidatesList';
import { Loading } from '../components/shared/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { formatFullDate } from '../utils/formatDate';

/**
 * Page showing all candidates/applications for a specific job
 */
export function JobCandidates() {
    const { jobId } = useParams();
    const { candidates, job, loading, error, refetch } = useCandidates(jobId);

    if (loading) {
        return <Loading message="Loading candidates..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    if (!job) {
        return <ErrorMessage message="Job not found" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </Link>

            {/* Job Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
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
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {formatFullDate(job.datePosted)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <CandidatesList candidates={candidates} jobTitle={job.title} />
        </div>
    );
}
