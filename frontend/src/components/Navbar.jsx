import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);

    // Debounce effect for the search API call
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const delayDebounceFn = setTimeout(() => {
            apiClient.get('/global-search', { params: { query: searchQuery } })
                .then(response => setSearchResults(response.data))
                .catch(error => console.error("Search failed:", error))
                .finally(() => setIsSearching(false));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Effect to hide the search dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
                setSearchQuery('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleResultClick = (result) => {
        setSearchQuery('');
        setSearchResults([]);

        switch(result.type) {
            case 'citizen':
                navigate('/citizens');
                break;
            case 'vehicle':
                navigate(`/vehicles/${result.id}/documents`);
                break;
            case 'learner_license':
                navigate('/licenses');
                break;
            case 'driving_license':
                navigate('/driving-licenses');
                break;
            case 'permit':
                // This logic would need to be enhanced if a direct link is needed
                break;
            default:
                navigate('/dashboard'); // Fallback
                break;
        }
    };

    if (!user) {
        return null; // Don't render navbar if user is not logged in
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/citizens">ParivahanIO</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><NavLink className="nav-link" to="/user">My Profile</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/licenses">Learner Licenses</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/driving-licenses">Driving Licenses</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/citizens">Citizens</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/reports">Reports</NavLink></li>

                        {user.role === 'admin' && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Admin Tools</a>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/groups">Manage Groups</Link></li>
                                    <li><Link className="dropdown-item" to="/admin/users">Manage Users</Link></li>
                                </ul>
                            </li>
                        )}
                        {user.role === 'group_manager' && (
                            <li className="nav-item"><NavLink className="nav-link" to="/manager">Manage Group Users</NavLink></li>
                        )}
                    </ul>

                    {/* Global Search Bar */}
                    <div className="d-flex mx-auto" style={{ position: 'relative' }} ref={searchRef}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Global Search..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {/* ✅ FIX: Changed dropdown-menu-dark to dropdown-menu for better contrast */}
                        {(isSearching || searchResults.length > 0 || searchQuery.length >= 2) && (
                            <ul className="dropdown-menu show" style={{ position: 'absolute', top: '100%', width: '100%', zIndex: 1050 }}>
                                {isSearching && <li className="dropdown-item-text">Searching...</li>}
                                {!isSearching && searchResults.map(result => (
                                    <li key={`${result.type}-${result.id}`}>
                                        <button className="dropdown-item" onClick={() => handleResultClick(result)}>
                                            <strong>{result.title}</strong>
                                            <small className="d-block text-muted">{result.description}</small>
                                        </button>
                                    </li>
                                ))}
                                {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && <li className="dropdown-item-text">No results found.</li>}
                            </ul>
                        )}
                    </div>

                    {/* User Info and Logout */}
                    <span className="navbar-text ms-auto me-3 d-none d-lg-inline">
                        Logged in as: <strong>{user.name}</strong> ({user.role})
                    </span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
