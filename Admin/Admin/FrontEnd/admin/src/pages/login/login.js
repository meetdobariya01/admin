import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUserLock, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:7000/admin/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Direct login button (dev bypass)
  const handleDirectLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:7000/admin/auth/login", {
        email: "admin@example.com",
        password: "admin123",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Direct login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xl={4} lg={5} md={7} sm={10}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="login-card">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="login-header text-center">
                  <FaUserLock className="login-icon" size={50} />
                  <h4>Admin Login</h4>
                  <p>Sign in to your dashboard</p>
                </motion.div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-icon">
                      <FaEnvelope />
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-icon">
                      <FaLock />
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" className="login-btn w-100" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-2">
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={handleDirectLogin}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Direct Login (Dev)"}
                    </Button>
                  </motion.div>
                </Form>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
