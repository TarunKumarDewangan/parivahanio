import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="app-container bg-light" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* ✅ NEW: This wrapper will center the content and add margins */}
            <div className="page-content-wrapper flex-grow-1">
                <main className="container-fluid p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
