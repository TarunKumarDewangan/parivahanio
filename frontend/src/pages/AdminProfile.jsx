import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig"; // ✅ Use the centralized API client
import Layout from "../components/Layout";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Use the apiClient which automatically includes the auth token
        const { data } = await apiClient.get("/me");
        setUser(data.user);
        setName(data.user.name);
        setPhone(data.user.phone);
      } catch {
        setMessage("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use the apiClient for the PUT request
      const { data } = await apiClient.put(
        `/users/${user.id}`,
        { name, phone, ...(password && { password }) }
      );
      setMessage(data.message);
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <Layout>
      <h2>Admin Profile</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {user ? (
        <form onSubmit={handleUpdateProfile} className="card p-3">
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>New Password (optional)</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Update Profile</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
};

export default AdminProfile;
