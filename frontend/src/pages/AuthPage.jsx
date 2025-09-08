import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosConfig";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, login, loading } = useAuth(); // Get user and loading state from context

  // ✅ This effect handles redirection for already logged-in users.
  useEffect(() => {
    // Don't do anything while the context is still checking the user's auth status.
    if (loading) {
      return;
    }

    // If the auth check is complete and a user exists, redirect them.
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "group_manager") {
        navigate("/manager");
      } else {
        navigate("/user");
      }
    }
  }, [user, loading, navigate]); // Rerun this effect if user, loading, or navigate changes.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const { data } = await apiClient.post(endpoint, form);
      // The login function from context will handle setting the user and token
      login(data.user, data.token);

      // The useEffect hook above will now handle the redirection automatically
      setMessage("Success! Redirecting...");
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  // While checking auth or if user is logged in, render nothing.
  // The useEffect will handle the redirect.
  if (loading || user) {
    return null; // Or you could return a loading spinner component
  }

  // Only render the login form if not loading AND there is no user.
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 bg-light"
    >
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-3">
            {isLogin ? "Login" : "Register"}
          </h3>
          {message && <div className="alert alert-info">{message}</div>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required={!isLogin}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 mt-2" variant="primary">
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            {isLogin ? (
              <p>
                Need an account?{" "}
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </span>
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthPage;
