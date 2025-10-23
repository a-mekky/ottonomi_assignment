import express from 'express';
import { getAllJobs, getJobById, createJob } from '../controllers/jobController.js';
import { validateJob } from '../middleware/validateRequest.js';

const router = express.Router();

// GET /api/jobs - Get all jobs
router.get('/', getAllJobs);

// GET /api/jobs/:id - Get single job
router.get('/:id', getJobById);

// POST /api/jobs - Create new job
router.post('/', validateJob, createJob);

export default router;