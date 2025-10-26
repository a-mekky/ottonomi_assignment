import express from 'express';
import {
    getAllJobsWithStats,
    getApplicationsForJob,
    getApplicationDetails,
    downloadApplicationCV,
    getDashboardStats
} from '../controllers/dashboardController.js';

const router = express.Router();

// TODO: Add authentication middleware here in the future. Currently, all routes are public.
// Example: router.use(authenticateUser);

// GET /api/dashboard/stats - Get overall dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/jobs - Get all jobs with application counts and statistics
router.get('/jobs', getAllJobsWithStats);

// GET /api/dashboard/jobs/:jobId/applications - Get all applications for a specific job
router.get('/jobs/:jobId/applications', getApplicationsForJob);

// GET /api/dashboard/applications/:id - Get single application details with populated job info
router.get('/applications/:id', getApplicationDetails);

// GET /api/dashboard/applications/:id/cv - Download CV file for an application
router.get('/applications/:id/cv', downloadApplicationCV);

export default router;
