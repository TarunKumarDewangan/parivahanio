import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/axiosConfig";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      const targetRoute = user.role === 'admin' ? '/admin' : '/user';
      navigate(targetRoute);
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    setMessage("");
    setLoading(true);

    try {
      const rootURL = apiClient.defaults.baseURL.replace('/api', '');
      await axios.get(`${rootURL}/sanctum/csrf-cookie`, { withCredentials: true });

      // ✅ FINAL FIX: Use a direct axios call to the correct root endpoint for login/register
      const { data } = await axios.post(`${rootURL}${endpoint}`, form, { withCredentials: true });

      login(data.user);

    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("Login endpoint not found. Please check server configuration.");
      } else if (err.response?.status === 419) {
        setMessage("Your session has expired. Please refresh the page and try again.");
      } else if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        setMessage(Object.values(errors).flat().join(' '));
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) return null;

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
                <Form.Control type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required={!isLogin} disabled={loading}/>
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required disabled={loading}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required disabled={loading}/>
            </Form.Group>
            <Button type="submit" className="w-100 mt-2" variant="primary" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? "Login" : "Register")}
            </Button>
          </Form>
          <div className="text-center mt-3">
            {isLogin ? (
              <p>Need an account? <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsLogin(false)}>Register</span></p>
            ) : (
              <p>Already have an account? <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsLogin(true)}>Login</span></p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthPage;
