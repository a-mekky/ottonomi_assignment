import multer from 'multer';
import path from 'path';
import fs from 'fs';


// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // More secure filename: timestamp + random + sanitized original name
        const sanitizedName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .substring(0, 50);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${sanitizedName}`);
    },
});

// File filter (only PDF and DOC)
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type or extension. Only PDF and DOC, and DOCX files are allowed.'), false);
    }
};

// Export configured multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});


export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 5MB limit',
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field. Use "cv" as field name',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Custom file filter errors
    if (err.message.includes('Invalid file type')) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next(err);
};