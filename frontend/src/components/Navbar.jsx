import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return null; // Don't render navbar on login page
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/citizens">ParivahanIO</Link>

                {/* Hamburger Button for small screens */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible container for links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Main Navigation Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/user">My Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/licenses">Learner Licenses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/driving-licenses">Driving Licenses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/citizens">Citizens</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/reports">Reports</Link>
                        </li>

                        {/* Conditional Admin Links */}
                        {user.role === 'admin' && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownAdmin" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Admin Tools
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownAdmin">
                                    <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/groups">Manage Groups</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/users">Manage Users</Link></li>
                                </ul>
                            </li>
                        )}

                        {/* Conditional Manager Link */}
                        {user.role === 'group_manager' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/manager">Manage Group Users</Link>
                            </li>
                        )}
                    </ul>

                    {/* Right-aligned user info and logout button */}
                    <span className="navbar-text me-3">
                        Logged in as: <strong>{user.name}</strong> ({user.role})
                    </span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
