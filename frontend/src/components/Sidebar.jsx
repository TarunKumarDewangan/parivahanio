import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column p-3 bg-dark text-white"
      style={{ height: "100vh", width: "220px" }}
    >
      <h4 className="mb-4">Dashboard</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        {/* --- GENERAL LINKS FOR ALL ROLES --- */}
        <li><Link to="/user" className="nav-link text-white">My Profile</Link></li>
        <li><Link to="/licenses" className="nav-link text-white">Manage Learner Licenses</Link></li>

        {/* ✅ NEW DRIVING LICENSE LINK */}
        <li><Link to="/driving-licenses" className="nav-link text-white">Manage Driving Licenses</Link></li>

        <li><Link to="/citizens" className="nav-link text-white">Manage Citizens</Link></li>
        <li><Link to="/reports" className="nav-link text-white">Reports</Link></li>

        <hr/>

        {/* --- ROLE-SPECIFIC LINKS --- */}
        {user && user.role === "admin" && (
          <>
            <li><Link to="/admin" className="nav-link text-white">Admin Dashboard</Link></li>
            <li><Link to="/admin/groups" className="nav-link text-white">Manage Groups</Link></li>
            <li><Link to="/admin/users" className="nav-link text-white">Manage Users</Link></li>
          </>
        )}
        {user && user.role === "group_manager" && (
          <>
            <li><Link to="/manager" className="nav-link text-white">Manage Group Users</Link></li>
          </>
        )}
      </ul>
      <hr />
      <div>
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
