import React, { memo } from 'react';

export const Input = memo(function Input({
    label,
    error,
    icon: Icon,
    className = '',
    required = false,
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-white border-2 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        } rounded-xl transition-colors outline-none text-gray-900 placeholder-gray-400`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
});