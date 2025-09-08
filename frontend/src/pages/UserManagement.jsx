import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "", phone: "", password: "", role: "user", group_id: "",
  });
  const [editUser, setEditUser] = useState(null);

  // The fetchUsers, fetchGroups, and other handler functions remain the same.
  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.get("/users");
      setUsers(data.users || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load users");
    }
  };

  const fetchGroups = async () => {
    try {
      const { data } = await apiClient.get("/groups");
      setGroups(data.groups || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load groups for assignment");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const url = editUser ? `/users/${editUser.id}` : "/users";
    const method = editUser ? "put" : "post";
    const payload = { ...newUser };
    if (editUser && !payload.password) {
      delete payload.password;
    }

    try {
      const { data } = await apiClient[method](url, payload);
      setMessage(data.message);
      setNewUser({ name: "", phone: "", password: "", role: "user", group_id: "" });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
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
      name: user.name, phone: user.phone, password: "", role: user.role, group_id: user.group_id || "",
    });
  };

  const cancelEdit = () => {
    setEditUser(null);
    setNewUser({ name: "", phone: "", password: "", role: "user", group_id: "" });
  };

  return (
    <Layout>
      <h2 className="mb-3">Manage Users</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3">
        <h4>{editUser ? "Edit User / Manager" : "Create User / Manager"}</h4>
        <form onSubmit={handleUserSubmit} className="mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-md">
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
            <div className="col-md">
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
            <div className="col-md">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder={editUser ? "New Password (optional)" : "Password"}
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required={!editUser}
              />
            </div>
            <div className="col-md">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="group_manager">Group Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md">
              <label className="form-label">Group</label>
              <select
                className="form-select"
                value={newUser.group_id}
                onChange={(e) =>
                  setNewUser({ ...newUser, group_id: e.target.value })
                }
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            {/* --- BUTTONS --- */}
            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-success w-100">
                {editUser ? "Update" : "Add"}
              </button>
              {/* ✅ Conditionally render Cancel button */}
              {editUser && (
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
            {/* ------------- */}
          </div>
        </form>

        <hr />

        <h5 className="mt-3">Users List</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{u.role}</td>
                  <td>{u.group?.name || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => startEditUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
