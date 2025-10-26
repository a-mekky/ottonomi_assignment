import React from 'react';
import { Users } from 'lucide-react';
import { CandidateCard } from './CandidateCard';

/**
 * List component that displays multiple candidates
 * Shows empty state if no candidates
 */
export function CandidatesList({ candidates, jobTitle }) {
    if (candidates.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 border-2 border-gray-100 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Applications Yet
                </h3>
                <p className="text-gray-600">
                    Candidates will appear here when they apply to {jobTitle}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Applications ({candidates.length})
                </h2>
                <p className="text-gray-600 mt-1">
                    Review and download CVs from candidates who applied
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <CandidateCard key={candidate._id} candidate={candidate} />
                ))}
            </div>
        </div>
    );
}
