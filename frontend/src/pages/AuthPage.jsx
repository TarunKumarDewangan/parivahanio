import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosConfig"; // ✅ THE CRUCIAL IMPORT

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  // Redirect if already logged in
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
      // ✅ Using the correct, globally configured apiClient
      const { data } = await apiClient.post(endpoint, form);
      login(data.user, data.token);
      setMessage("Success! Redirecting...");
      // The useEffect hook will handle the redirect
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // Handle Laravel's validation errors
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(' ');
        setMessage(errorMessages);
      } else if (err.response && err.response.data && err.response.data.message) {
        // Handle other specific API error messages
        setMessage(err.response.data.message);
      } else {
        // Generic fallback
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
        setLoading(false);
    }
  };

  // Render nothing while the context is checking for an existing session
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
