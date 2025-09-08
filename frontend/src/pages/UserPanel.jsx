import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_BASE = "http://127.0.0.1:8000/api";

const UserPanel = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Fetch logged-in user profile
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(API_BASE + "/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
    } catch {
      setMessage("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Update password securely
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        API_BASE + "/me/password",
        {
          old_password: oldPassword,
          password,
          password_confirmation: passwordConfirmation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(data.message || "Password updated successfully");
      setOldPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Layout>
      <h2 className="mb-3">My Profile</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {user ? (
        <div className="card p-3 mb-4">
          <h5>Profile Information</h5>
          <p>
            <strong>Name:</strong> {user.name} <br />
            <strong>Phone:</strong> {user.phone} <br />
            <strong>Role:</strong> {user.role} <br />
            <strong>Group:</strong> {user.group?.name || "Not Assigned"}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Password Update */}
      {user && (
        <div className="card p-3">
          <h5>Change Password</h5>
          <form onSubmit={handlePasswordUpdate}>
            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="btn btn-warning">Update Password</button>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default UserPanel;
