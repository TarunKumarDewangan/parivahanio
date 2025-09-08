import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_BASE = "http://127.0.0.1:8000/api";

const AdminProfile = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(API_BASE + "/me", { headers });
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
      const { data } = await axios.put(
        API_BASE + `/users/${user.id}`,
        { name, phone, ...(password && { password }) },
        { headers }
      );
      setMessage(data.message);
      setPassword("");
    } catch {
      setMessage("Error updating profile");
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
