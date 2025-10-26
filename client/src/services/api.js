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
    getAll: async (params = {}) => {
        const response = await api.get('/jobs', { params });
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

// Application Service
export const applicationService = {
    // Submit job application with CV
    submit: async (applicationData, onProgress) => {
        try {
            // Validate before sending
            if (!applicationData.name?.trim()) {
                throw new Error('Name is required');
            }
            if (!applicationData.email?.trim()) {
                throw new Error('Email is required');
            }
            if (!applicationData.cv) {
                throw new Error('CV file is required');
            }
            const formData = new FormData();
            formData.append('name', applicationData.name);
            formData.append('email', applicationData.email);
            formData.append('jobId', applicationData.jobId);
            formData.append('cv', applicationData.cv);

            // Send request
            const response = await api.post('/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }, timeout: 60000, // 60 second timeout
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            });
            return response.data;
        } catch (error) {
            // Enhanced error handling
            if (error.code === 'ECONNABORTED') {
                throw new Error('Upload timeout. Please check your connection and try again.');
            }
            if (error.response?.status === 413) {
                throw new Error('File too large. Maximum size is 5MB.');
            }
            if (error.response?.status === 415) {
                throw new Error('Unsupported file type. Please upload PDF, DOC, or DOCX.');
            }
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to submit application. Please try again.');
        }
    },
};

// Dashboard Service
export const dashboardService = {
    // Get overall dashboard statistics
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    // Get all jobs with application counts
    getJobsWithStats: async (params = {}) => {
        const response = await api.get('/dashboard/jobs', { params });
        return response.data;
    },

    // Get applications for a specific job
    getApplicationsForJob: async (jobId, params = {}) => {
        const response = await api.get(`/dashboard/jobs/${jobId}/applications`, { params });
        return response.data;
    },

    // Get single application details
    getApplicationDetails: async (applicationId) => {
        const response = await api.get(`/dashboard/applications/${applicationId}`);
        return response.data;
    },

    // Download CV for an application
    downloadCV: async (applicationId) => {
        const response = await api.get(`/dashboard/applications/${applicationId}/cv`, {
            responseType: 'blob', // Important for file download
        });
        return response;
    },
};

export default api;