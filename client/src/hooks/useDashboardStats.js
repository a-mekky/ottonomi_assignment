import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

/**
 * Hook to fetch dashboard statistics
 * Returns: { stats, loading, error, refetch }
 */
export function useDashboardStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch statistics');
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refetch: fetchStats };
}
