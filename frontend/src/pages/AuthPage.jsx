import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";
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
      navigate(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    setMessage("");
    setLoading(true);

    try {
      // Get the root URL directly from the environment variable
      const rootURL = import.meta.env.VITE_API_BASE_URL;

      // Step 1: Get the security cookie from the correct /sanctum/csrf-cookie endpoint
      await axios.get(`${rootURL}/sanctum/csrf-cookie`, { withCredentials: true });

      // Step 2: Post the login/register data to the correct endpoint
      const { data } = await axios.post(`${rootURL}${endpoint}`, form, { withCredentials: true });

      login(data.user);

    } catch (err) {
      if (err.response) {
        if (err.response.status === 422 && err.response.data.errors) {
          const errors = err.response.data.errors;
          setMessage(Object.values(errors).flat().join(' '));
        } else if (err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else if (err.response.status === 404) {
          setMessage(`Error: The route was not found. Please check your backend routes.`);
        }
        else {
          setMessage("An unexpected server error occurred. Please try again.");
        }
      } else {
        setMessage("Could not connect to the server. Please check your network connection.");
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
