import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

// Job Service
export const jobService = {
    // Get all jobs
    getAll: async () => {
        const response = await api.get('/jobs');
        return response.data;
    },

    // Get single job by ID
    getById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },

    // Create new job
    create: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },
};

export default api;