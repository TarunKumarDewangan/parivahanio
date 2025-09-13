import React, { useState } from "react";
import apiClient from "../api/axiosConfig"; // ✅ Use the centralized API client
import Layout from "../components/Layout";

const ApiTestPage = () => {
  const [response, setResponse] = useState("");

  // Test: try creating a group
  const testCreateGroup = async () => {
    try {
      // ✅ Use the apiClient which automatically includes the auth token
      const { data } = await apiClient.post("/groups", {
        name: "Test Group" + Math.floor(Math.random() * 1000),
      });
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.response?.data?.message || "Error: " + err.message);
    }
  };

  // Test: try resetting a user's password
  const testResetPassword = async () => {
    try {
      // ✅ Use the apiClient for the PUT request
      const { data } = await apiClient.put(
        "/users/2", // assume ID=2 exists
        { password: "newpassword123" }
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
