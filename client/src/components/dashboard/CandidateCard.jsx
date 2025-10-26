import React, { useState } from 'react';
import { User, Mail, Calendar, Download } from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatDate';
import { dashboardService } from '../../services/api';

/**
 * Card component for individual candidate
 * Shows candidate info and allows CV download
 */
export function CandidateCard({ candidate }) {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownloadCV = async () => {
        try {
            setDownloading(true);
            setError(null);

            // Download CV as blob
            const response = await dashboardService.downloadCV(candidate._id);

            // Create blob URL and trigger download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from content-disposition or use default
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : `CV_${candidate.name.replace(/\s+/g, '_')}.pdf`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading CV:', err);
            setError('Failed to download CV. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-6 hover:shadow-xl transition-shadow">
            {/* Candidate Info */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-8 h-8 text-blue-600" />
                </div>

                {/* Details */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {candidate.name}
                    </h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                                Applied {formatRelativeDate(candidate.appliedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download CV Button */}
            <button
                onClick={handleDownloadCV}
                disabled={downloading}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                {downloading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        Download CV
                    </>
                )}
            </button>

            {/* Error Message */}
            {error && (
                <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
}
