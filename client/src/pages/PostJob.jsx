import React from 'react';
import { Sparkles } from 'lucide-react';
import { JobForm } from '../components/job/JobForm';

export function PostJob() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Decorative Header Section */}
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

            {/* Form Component */}
            <JobForm />
        </div>
    );
}
