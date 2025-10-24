import React, { memo } from 'react';

export const TextArea = memo(function TextArea({
    label,
    error,
    className = '',
    required = false,
    rows = 4,
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
            <textarea
                rows={rows}
                className={`w-full px-4 py-3.5 bg-white border-2 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    } rounded-xl transition-colors outline-none text-gray-900 placeholder-gray-400 resize-none`}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
});