import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/api';

export function useJobDetails(jobId) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setError('Job ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getById(jobId);
      setJob(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job details');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return { job, loading, error, refetch: fetchJob };
}