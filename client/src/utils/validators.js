// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// File type validation
export const validateFileType = (file, allowedTypes) => {
    if (!file || !file.name) return false;
    const fileName = file.name.toLowerCase();
    return allowedTypes.some(type => fileName.endsWith(type));
};

// File size validation (size in MB)
export const validateFileSize = (file, maxSizeMB) => {
    if (!file) return false;
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
};

// Constants for file validation
export const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx'];
export const MAX_FILE_SIZE_MB = 5;