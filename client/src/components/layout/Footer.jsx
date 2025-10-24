import React from 'react';
import { Briefcase } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-linear-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                JobBoard
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Your gateway to amazing career opportunities. Connect with top employers and find your dream job today.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © {currentYear} JobBoard. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}