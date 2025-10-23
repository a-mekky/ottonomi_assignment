import express from 'express';
import { createApplication } from '../controllers/applicationController.js';
import { upload, handleMulterError } from '../middleware/uploadMiddleware.js';
import { validateApplication } from '../middleware/validateRequest.js';

const router = express.Router();

// POST /api/applications - Submit application with CV
router.post('/', 
    (req, res, next) => {
        upload.single('cv')(req, res, (err) => {
            if (err) {
                return handleMulterError(err, req, res, next);
            }
            next();
        });
    },
    validateApplication,
    // Cleanup middleware for validation errors
    (err, req, res, next) => {
        // If there's an error and a file was uploaded, clean it up
        if (err && req.file) {
            import('fs').then(({ promises: fsPromises }) => {
                fsPromises.unlink(req.file.path).catch(unlinkErr => {
                    console.error('Error cleaning up file after validation failure:', unlinkErr);
                });
            });
        }
        next(err);
    },
    createApplication
);

export default router;