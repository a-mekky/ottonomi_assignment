import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/api';

/**
 * Hook to fetch candidates for a specific job
 * Returns: { candidates, job, loading, error, refetch, pagination }
 */
export function useCandidates(jobId) {
    const [candidates, setCandidates] = useState([]);
    const [job, setJob] = useState(null);
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

    const fetchCandidates = useCallback(async (page = 1) => {
        if (!jobId) {
            setError('Job ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getApplicationsForJob(jobId, { page, limit: 12 });
            setCandidates(response.data || []);
            setJob(response.job || null);
            setPagination(response.pagination || pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch candidates');
            setCandidates([]);
            setJob(null);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchCandidates(1);
    }, [fetchCandidates]);

    return { candidates, job, loading, error, refetch: fetchCandidates, pagination };
}
