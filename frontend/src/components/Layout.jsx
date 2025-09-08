import React from 'react';
import Navbar from './Navbar'; // ✅ Import the new Navbar

// NOTE: We no longer import Sidebar here.

const Layout = ({ children }) => {
    return (
        // ✅ SWITCH: The structure is now a simple div, not a flex container.
        <div className="app-container">
            <Navbar />
            <main className="container-fluid p-4 bg-light" style={{ minHeight: 'calc(100vh - 56px)' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
