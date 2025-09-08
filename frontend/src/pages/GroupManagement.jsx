import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [editGroup, setEditGroup] = useState(null);

  const fetchGroups = async () => {
    try {
      const { data } = await apiClient.get("/groups");
      setGroups(data.groups || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load groups");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    const url = editGroup ? `/groups/${editGroup.id}` : "/groups";
    const method = editGroup ? "put" : "post";
    try {
      const { data } = await apiClient[method](url, { name: newGroup });
      setMessage(data.message);
      setNewGroup("");
      setEditGroup(null);
      fetchGroups();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving group");
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm("Delete this group? This may also delete its users.")) return;
    try {
      const { data } = await apiClient.delete(`/groups/${id}`);
      setMessage(data.message);
      fetchGroups();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting group");
    }
  };

  const startEditGroup = (group) => {
    setEditGroup(group);
    setNewGroup(group.name);
  };

  return (
    <Layout>
      <h2 className="mb-3">Manage Groups</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3 mb-4">
        <h4>{editGroup ? "Edit Group" : "Create Group"}</h4>
        <form onSubmit={handleGroupSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Group name"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            required
          />
          <button className="btn btn-primary">{editGroup ? "Update" : "Add"}</button>
          {editGroup && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditGroup(null);
                setNewGroup("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <hr />
        <h5>Existing Groups</h5>
        <ul className="list-group mt-3">
          {groups.map((g) => (
            <li
              key={g.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {g.name}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => startEditGroup(g)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteGroup(g.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default GroupManagement;
