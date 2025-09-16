import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosConfig";
import axios from "axios"; // ✅ 1. Import axios directly for the special call

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "group_manager") navigate("/manager");
      else navigate("/user");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    setMessage("");
    setLoading(true);

    try {
      // ✅ 2. Use a direct axios call to the FULL, CORRECT URL for the handshake.
      // This bypasses the apiClient's baseURL which adds the extra '/api'.
      await axios.get(`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
          withCredentials: true,
      });

      // Now, proceed with the login/register request using the normal apiClient
      const { data } = await apiClient.post(endpoint, form);
      login(data.user, data.token);
      setMessage("Success! Redirecting...");

    } catch (err) {
      // Check for 404 on the csrf-cookie route
      if (err.response && err.response.config.url.includes('sanctum/csrf-cookie')) {
          setMessage("Error: Could not connect to the authentication server. Please check the API URL.");
      } else if (err.response && err.response.status === 419) {
        setMessage("Your session has expired. Please refresh the page and try again.");
      } else if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(' ');
        setMessage(errorMessages);
      } else if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
        setLoading(false);
    }
  };

  if (authLoading || user) {
    return null;
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-3">{isLogin ? "Login" : "Register"}</h3>
          {message && <div className="alert alert-danger">{message}</div>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                  disabled={loading}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
            </Form.Group>
            <Button type="submit" className="w-100 mt-2" variant="primary" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? "Login" : "Register")}
            </Button>
          </Form>
          <div className="text-center mt-3">
            {isLogin ? (
              <p>Need an account?{" "}<span style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsLogin(false)}>Register</span></p>
            ) : (
              <p>Already have an account?{" "}<span style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsLogin(true)}>Login</span></p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthPage;
