import { body, validationResult } from 'express-validator';

export const validateJob = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ max: 200 })
        .withMessage('Title must be less than 200 characters'),
    body('company')
        .trim()
        .notEmpty()
        .withMessage('Company name is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Job description is required')
        .isLength({ min: 50 })
        .withMessage('Description must be at least 50 characters'),
    body('location')
        .optional()
        .trim(),
    body('salary')
        .optional()
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        next();
    },
];