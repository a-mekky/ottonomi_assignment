import React, { useState } from 'react';
import { Input } from '../shared/Input';
import { FileUpload } from '../shared/FileUpload';
import { User, Mail, Send, CheckCircle } from 'lucide-react';
import { applicationService } from '../../services/api';
import { validateEmail, validateFileType, validateFileSize, ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../utils/validators';

export function ApplicationForm({ jobId }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cv: null,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (file) => {
        setFormData(prev => ({ ...prev, cv: file }));
        // Clear error when valid file is selected
        if (file && errors.cv) {
            setErrors(prev => ({ ...prev, cv: '' }));
        }
    };

    // Handler for file validation errors
    const handleFileError = (errorMessage) => {
        if (errorMessage) {
            setErrors(prev => ({ ...prev, cv: errorMessage }));
        } else {
            // Clear error
            setErrors(prev => {
                const { cv: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.cv) {
            newErrors.cv = 'Please upload your CV';
        } else {
            if (!validateFileType(formData.cv, ALLOWED_FILE_TYPES)) {
                newErrors.cv = 'Only PDF, DOC, and DOCX files are allowed';
            } else if (!validateFileSize(formData.cv, MAX_FILE_SIZE_MB)) {
                newErrors.cv = `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const abortController = new AbortController();

        try {
            setLoading(true);
            await applicationService.submit({
                ...formData,
                jobId,
            },
                {
                    signal: abortController.signal,
                    onProgress: (percent) => setUploadProgress(percent)
                });

            setSuccess(true);
            // Reset form
            setFormData({ name: '', email: '', cv: null });
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Failed to submit application. Please try again.'
            });
        } finally {
            setLoading(false);
            abortController.abort();
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border-2 border-gray-100 p-8">
                <div className="text-center py-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        Application Submitted!
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for applying! We'll review your application and get back to you soon.
                    </p>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setErrors({});      // Clear all errors
                            setFormData({ name: '', email: '', cv: null }); // Reset form data
                        }}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200"
                    >
                        Submit Another Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border-2 border-gray-100 p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Apply for this Position
                </h2>
                <p className="text-gray-600">
                    Fill out the form below and we'll get back to you shortly
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-red-700 font-medium">{errors.submit}</p>
                    </div>
                )}

                {/* Name Input */}
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    icon={User}
                    error={errors.name}
                    required
                />

                {/* Email Input */}
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    icon={Mail}
                    error={errors.email}
                    required
                />

                {/* CV Upload */}
                <FileUpload
                    label="Upload Your CV"
                    onChange={handleFileChange}
                    onError={handleFileError}
                    error={errors.cv}
                    required
                />

                {/* Upload Progress Bar */}
                {loading && uploadProgress > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-900">
                                Uploading your application...
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-linear-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Submit Application
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}