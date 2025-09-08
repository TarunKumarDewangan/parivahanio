import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const ManagerPanel = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    password: "", // <-- Password field added
    role: "user",
  });
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.get("/users");
      setUsers(data.users);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Managers can't change passwords, so remove it for updates
        const { password, ...updateData } = newUser;
        const { data } = await apiClient.put(`/users/${editUser.id}`, updateData);
        setMessage(data.message);
      } else {
        const { data } = await apiClient.post("/users", newUser);
        setMessage(data.message);
      }
      setNewUser({ name: "", phone: "", password: "", role: "user" });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const { data } = await apiClient.delete(`/users/${id}`);
      setMessage(data.message);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting user");
    }
  };

  const startEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      phone: user.phone,
      password: "", // Clear password field for editing
      role: "user",
    });
  };

  return (
    <Layout>
      <h2 className="mb-3">Group Manager Panel</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3 mb-4">
        <h4>{editUser ? "Edit User" : "Add New User"}</h4>
        <form onSubmit={handleUserSubmit}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                required
              />
            </div>
            {/* Show password field only when creating a new user */}
            {!editUser && (
              <div className="col-md-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required={!editUser} // Required only on create
                />
              </div>
            )}
            <div className="col-md-2">
              <button className="btn btn-success w-100">
                {editUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h4>My Group Users</h4>
        <table className="table table-bordered mt-2">
          {/* Table content remains the same... */}
        </table>
      </div>
    </Layout>
  );
};

export default ManagerPanel;
