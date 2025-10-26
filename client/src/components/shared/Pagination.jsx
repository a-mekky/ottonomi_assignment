import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable pagination component
 * Displays page numbers with Previous/Next buttons
 */
export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
    // Don't render if only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7; // Max page numbers to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, and pages around current
            if (currentPage <= 3) {
                // Near start: 1 2 3 4 ... last
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end: 1 ... last-3 last-2 last-1 last
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                // Middle: 1 ... prev current next ... last
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md scale-105'
                                    : 'bg-white border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:shadow-sm'
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all"
                aria-label="Next page"
            >
                <span className="hidden sm:inline text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}