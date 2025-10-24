import { useState, useEffect } from 'react';
import { jobService } from '../services/api';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAll();
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