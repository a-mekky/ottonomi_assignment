import React from 'react';

/**
 * Reusable statistics card component
 * Shows icon, label, value, and optional change indicator
 */
export function StatsCard({ icon: Icon, label, value, change, color = 'blue' }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-6">
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                    {change && (
                        <p className="text-sm text-gray-600 mt-1">
                            {change}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
