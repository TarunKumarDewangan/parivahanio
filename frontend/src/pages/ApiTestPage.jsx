import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_BASE = "http://127.0.0.1:8000/api";

const ApiTestPage = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [response, setResponse] = useState("");

  // Test: try creating a group
  const testCreateGroup = async () => {
    try {
      const { data } = await axios.post(
        API_BASE + "/groups",
        { name: "Test Group" + Math.floor(Math.random() * 1000) },
        { headers }
      );
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.response?.data?.message || "Error: " + err.message);
    }
  };

  // Test: try resetting a user's password
  const testResetPassword = async () => {
    try {
      const { data } = await axios.put(
        API_BASE + "/users/2", // assume ID=2 exists
        { password: "newpassword123" },
        { headers }
      );
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.response?.data?.message || "Error: " + err.message);
    }
  };

  return (
    <Layout>
      <h2>API Test Page</h2>
      <p>Use this page to test Policies with current logged-in user.</p>

      <button className="btn btn-primary me-2" onClick={testCreateGroup}>
        Test Create Group
      </button>

      <button className="btn btn-danger" onClick={testResetPassword}>
        Test Reset User Password
      </button>

      <pre className="mt-3 bg-light p-3 border">{response}</pre>
    </Layout>
  );
};

export default ApiTestPage;
