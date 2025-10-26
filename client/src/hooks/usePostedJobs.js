import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

/**
 * Hook to fetch all posted jobs with application counts
 * Returns: { jobs, loading, error, refetch }
 */
export function usePostedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getJobsWithStats();
            setJobs(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, error, refetch: fetchJobs };
}
