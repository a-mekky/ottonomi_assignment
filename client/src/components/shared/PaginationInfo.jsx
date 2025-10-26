import React from 'react';

/**
 * Displays pagination info (e.g., "Showing 1-12 of 47 jobs")
 */
export function PaginationInfo({ currentPage, itemsPerPage, totalItems, className = '' }) {
    if (!totalItems || totalItems === 0) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <p className={`text-sm text-gray-600 ${className}`}>
            Showing <span className="font-semibold text-gray-900">{startItem}-{endItem}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> {totalItems === 1 ? 'job' : 'jobs'}
        </p>
    );
}

