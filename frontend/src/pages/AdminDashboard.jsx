import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, groups: 0, managers: 0 });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      // Fetch stats from the new, efficient endpoint
      const statsRes = await apiClient.get("/dashboard/stats");
      setStats(statsRes.data.stats);

      // Fetch user list for the table separately
      const usersRes = await apiClient.get("/users");
      setUsers(usersRes.data.users || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-danger">{message}</div>}

      {/* Stats Boxes */}
      <div className="row mb-4">
        <div className="col-md-4"><div className="card text-center shadow"><div className="card-body"><h5>Total Users</h5><h3>{stats.users}</h3></div></div></div>
        <div className="col-md-4"><div className="card text-center shadow"><div className="card-body"><h5>Total Groups</h5><h3>{stats.groups}</h3></div></div></div>
        <div className="col-md-4"><div className="card text-center shadow"><div className="card-body"><h5>Total Managers</h5><h3>{stats.managers}</h3></div></div></div>
      </div>

      {/* User + Group Table */}
      <h4>User List (with Groups)</h4>
      <table className="table table-bordered">
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Role</th><th>Group</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>{u.group?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default AdminDashboard;
