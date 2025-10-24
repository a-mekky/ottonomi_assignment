import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { jobService } from '../../services/api';

export function JobForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        salary: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Job description is required';
        } else if (formData.description.trim().length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            await jobService.create(formData);

            navigate('/', {
                state: { message: 'Job posted successfully!' }
            });
        } catch (error) {
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    if (err.path) {
                        backendErrors[err.path] = err.msg;
                    }
                });
                setErrors(backendErrors);
            } else {
                setErrors({
                    submit: error.response?.data?.message || 'Failed to post job. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        navigate('/');
    }, [navigate]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Post a New Job
                </h1>
                <p className="text-lg text-gray-600">
                    Find the perfect candidate for your team
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200 p-8 border-2 border-gray-100">
                {errors.submit && (
                    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-red-700 font-medium">{errors.submit}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <Input
                        label="Job Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior Full Stack Developer"
                        icon={Briefcase}
                        error={errors.title}
                        required
                    />

                    <Input
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Tech Innovations Inc"
                        icon={Building2}
                        error={errors.company}
                        required
                    />

                    <TextArea
                        label="Job Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity special..."
                        rows={6}
                        error={errors.description}
                        required
                    />

                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. San Francisco, CA (Hybrid)"
                        icon={MapPin}
                        error={errors.location}
                    />

                    <Input
                        label="Salary Range"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="e.g. $120,000 - $150,000"
                        icon={DollarSign}
                        error={errors.salary}
                    />
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold rounded-xl transition-colors text-gray-700"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Posting...
                            </span>
                        ) : (
                            'Post Job'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}