import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

/**
 * Hook to fetch posted jobs with pagination support
 * Returns: { jobs, loading, error, refetch, pagination }
 */
export function usePostedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getJobsWithStats({ page, limit: 12 });
            setJobs(response.data || []);
            setPagination(response.pagination || pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1);
    }, []);

    return { 
        jobs, 
        loading, 
        error, 
        refetch: fetchJobs, 
        pagination 
    };
}
