import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/api';

/**
 * Hook to fetch candidates for a specific job
 * Returns: { candidates, job, loading, error, refetch }
 */
export function useCandidates(jobId) {
    const [candidates, setCandidates] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCandidates = useCallback(async () => {
        if (!jobId) {
            setError('Job ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getApplicationsForJob(jobId);
            setCandidates(response.data || []);
            setJob(response.job || null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch candidates');
            setCandidates([]);
            setJob(null);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    return { candidates, job, loading, error, refetch: fetchCandidates };
}
