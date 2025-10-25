import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';

import { promises as fsPromises } from 'fs';

export const createApplication = async (req, res) => {
    let uploadedFilePath = null;
    try {
        const { name, email, jobId } = req.body;
        const cvFile = req.file;

        if (!cvFile) {
            return res.status(400).json({
                success: false,
                message: 'CV file is required',
            });
        }
        uploadedFilePath = cvFile.path;

        // Validate job exists and is active
        const job = await Job.findById(jobId).lean();
        if (!job) {
            // Clean up uploaded file
            try {
                await fsPromises.unlink(uploadedFilePath);
            } catch (unlinkError) {
                console.error('Error deleting file after job validation:', unlinkError);
            }
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            email: email.toLowerCase(),
            jobId
        }).lean();

        if (existingApplication) {
            // Clean up uploaded file
            try {
                await fsPromises.unlink(uploadedFilePath);
            } catch (unlinkError) {
                console.error('Error deleting file after duplicate check:', unlinkError);
            }
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job',
                appliedAt: existingApplication.appliedAt,
            });
        }

        // Create application with proper error handling for unique constraint
        try {
            const application = await Application.create({
                name,
                email,
                jobId,
                cvPath: cvFile.path,
            });

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application,
            });
        } catch (createError) {
            // Clean up uploaded file
            try {
                await fsPromises.unlink(uploadedFilePath);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }

            // Handle duplicate key error from unique index
            if (createError.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'You have already applied to this job',
                });
            }

            // Re-throw other errors to be caught by outer catch
            throw createError;
        }
    } catch (error) {
        // Clean up uploaded file on any error
        if (uploadedFilePath) {
            try {
                await fsPromises.unlink(uploadedFilePath);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        return res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message,
        });
    }
};