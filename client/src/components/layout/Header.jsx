import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Plus, Home, LayoutDashboard } from 'lucide-react';

export function Header() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-linear-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            JobBoard
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isActive('/')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">Browse Jobs</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isActive('/dashboard')
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <Link
                            to="/post-job"
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isActive('/post-job')
                                ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Post Job</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}