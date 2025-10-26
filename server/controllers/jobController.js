import mongoose from 'mongoose';
import { Job } from '../models/Job.js';
import { getPaginationParams, getPaginationMetadata, parseSortParam } from '../utils/pagination.js';


/**
 * Get all jobs with pagination
 * return : Array of job objects with pagination metadata
 */
export const getAllJobs = async (req, res) => {
    try {
        // Get pagination parameters
        const { page, limit, skip } = getPaginationParams(req.query);
        
        // Parse sort parameter
        const sort = parseSortParam(req.query.sort, '-datePosted');
        
        // Get total count for pagination metadata
        const totalItems = await Job.countDocuments();
        
        // Get paginated jobs
        const jobs = await Job.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
        
        // Generate pagination metadata
        const pagination = getPaginationMetadata(page, limit, totalItems);
        
        return res.status(200).json({
            success: true,
            pagination,
            data: jobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message,
        });
    }
};


/**
 * Get a job by ID
 * return : Object of job object 
 */
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format',
            });
        }

        const job = await Job.findById(id).lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.status(200).json({
            success: true,
            data: job,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message,
        });
    }
};


/**
 * Create a new job
 * return : Object of job object 
 */
export const createJob = async (req, res) => {
    try {
        const { title, company, description, location, salary } = req.body;

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary,
        });

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message,
        });
    }
};