import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}