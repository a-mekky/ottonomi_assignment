import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { getPaginationParams, getPaginationMetadata, parseSortParam } from '../utils/pagination.js';

/**
 * Get all jobs with application counts and statistics (paginated)
 * return : Array of job objects with application counts and statistics
 */
export const getAllJobsWithStats = async (req, res) => {
    try {
        // Get pagination parameters
        const { page, limit, skip } = getPaginationParams(req.query);
        
        // Parse sort parameter
        const sort = parseSortParam(req.query.sort, '-datePosted');
        
        // Get total count
        const totalItems = await Job.countDocuments();
        
        // Get paginated jobs
        const jobs = await Job.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Get application counts for these specific jobs only
        const jobIds = jobs.map(job => job._id);
        const applicationCounts = await Application.aggregate([
            {
                $match: { jobId: { $in: jobIds } }
            },
            {
                $group: {
                    _id: '$jobId',
                    count: { $sum: 1 },
                    latestApplication: { $max: '$appliedAt' }
                }
            }
        ]);

        // Create a map for quick lookup
        const countsMap = applicationCounts.reduce((acc, item) => {
            acc[item._id.toString()] = {
                count: item.count,
                latestApplication: item.latestApplication
            };
            return acc;
        }, {});

        // Combine jobs with their application counts
        const jobsWithStats = jobs.map(job => ({
            ...job,
            applicationCount: countsMap[job._id.toString()]?.count || 0,
            latestApplication: countsMap[job._id.toString()]?.latestApplication || null
        }));

        // Generate pagination metadata
        const pagination = getPaginationMetadata(page, limit, totalItems);

        return res.status(200).json({
            success: true,
            pagination,
            data: jobsWithStats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs with statistics',
            error: error.message,
        });
    }
};

/**
 * Get all applications for a specific job
 * return : Array of application objects
 */
export const getApplicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format',
            });
        }

        // Validate job exists
        const job = await Job.findById(jobId).lean();
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Get pagination parameters
        const { page, limit, skip } = getPaginationParams(req.query);
        
        // Parse sort parameter
        const sort = parseSortParam(req.query.sort, '-appliedAt');
        
        // Get total count for this job
        const totalItems = await Application.countDocuments({ jobId });
        
        // Get paginated applications
        const applications = await Application.find({ jobId })
            .select('-__v') // Exclude version key
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Generate pagination metadata
        const pagination = getPaginationMetadata(page, limit, totalItems);

        return res.status(200).json({
            success: true,
            pagination,
            job: {
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                datePosted: job.datePosted,
            },
            data: applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
};

/**
 * Get single application details with populated job info
 * return : Object of application object
 */
export const getApplicationDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID format',
            });
        }

        const application = await Application.findById(id)
            .populate('jobId', 'title company location salary description datePosted') // Include full job details
            .lean();

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching application details',
            error: error.message,
        });
    }
};

/**
 * Download CV file for an application
 * return : Blob of CV file
 */
export const downloadApplicationCV = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID format',
            });
        }

        const application = await Application.findById(id).lean();
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        const cvPath = application.cvPath;
        
        // Check if file exists
        if (!fs.existsSync(cvPath)) {
            return res.status(404).json({
                success: false,
                message: 'CV file not found on server',
            });
        }

        // Get filename and detect MIME type
        const filename = path.basename(cvPath);
        const ext = path.extname(filename).toLowerCase();
        
        let contentType = 'application/octet-stream';
        if (ext === '.pdf') contentType = 'application/pdf';
        else if (ext === '.doc') contentType = 'application/msword';
        else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);
        
        // Stream the file
        res.download(cvPath, filename, (err) => {
            if (err) {
                console.error('Error downloading CV file:', err);
                if (!res.headersSent) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error downloading CV file',
                    });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error processing CV download',
            error: error.message,
        });
    }
};

/**
 * Get overall dashboard statistics
 * return : Object of dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Get recent jobs (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentJobs = await Job.countDocuments({
            datePosted: { $gte: sevenDaysAgo }
        });

        const recentApplications = await Application.countDocuments({
            appliedAt: { $gte: sevenDaysAgo }
        });

        // Get top jobs by application count
        const topJobs = await Application.aggregate([
            {
                $group: {
                    _id: '$jobId',
                    applicationCount: { $sum: 1 }
                }
            },
            {
                $sort: { applicationCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            {
                $unwind: '$job'
            },
            {
                $project: {
                    title: '$job.title',
                    company: '$job.company',
                    applicationCount: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalJobs,
                    totalApplications,
                    recentJobs,
                    recentApplications,
                },
                topJobs
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message,
        });
    }
};
