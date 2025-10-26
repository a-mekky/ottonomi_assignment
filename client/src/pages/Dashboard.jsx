import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, TrendingUp, Clock } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { usePostedJobs } from '../hooks/usePostedJobs';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TopJobsList } from '../components/dashboard/TopJobsList';
import { JobsTable } from '../components/dashboard/JobsTable';
import { Loading } from '../components/shared/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage';

/**
 * Main dashboard page
 * Shows statistics and list of posted jobs
 */
export function Dashboard() {
    const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs, pagination } = usePostedJobs();

    const handleJobsPageChange = (page) => {
        refetchJobs(page);
    };

    // Combined loading state
    const loading = statsLoading || jobsLoading;
    const error = statsError || jobsError;

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={() => {
            refetchStats();
            refetchJobs();
        }} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                </div>
                <p className="text-lg text-gray-600">
                    Manage your job postings and review applications
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    icon={Briefcase}
                    label="Total Jobs"
                    value={stats?.overview?.totalJobs || 0}
                    color="blue"
                />
                <StatsCard
                    icon={Users}
                    label="Total Applications"
                    value={stats?.overview?.totalApplications || 0}
                    color="green"
                />
                <StatsCard
                    icon={TrendingUp}
                    label="Recent Jobs"
                    value={stats?.overview?.recentJobs || 0}
                    change="Last 7 days"
                    color="purple"
                />
                <StatsCard
                    icon={Clock}
                    label="Recent Applications"
                    value={stats?.overview?.recentApplications || 0}
                    change="Last 7 days"
                    color="orange"
                />
            </div>

            {/* Top Jobs Section */}
            {stats?.topJobs && stats.topJobs.length > 0 && (
                <div className="mb-8">
                    <TopJobsList topJobs={stats.topJobs} />
                </div>
            )}

            {/* Jobs Table */}
            <JobsTable jobs={jobs} pagination={pagination} onPageChange={handleJobsPageChange} />

            {/* Quick Action */}
            <div className="mt-8 text-center">
                <Link
                    to="/post-job"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200"
                >
                    <Briefcase className="w-5 h-5" />
                    Post New Job
                </Link>
            </div>
        </div>
    );
}
