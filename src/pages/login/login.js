import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUserLock, FaEnvelope, FaLock } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import "./login.css";

const Login = () => {
  return (
    <div>
      <div>
        <div className="login-page">
          <Container fluid>
            <Row className="justify-content-center align-items-center min-vh-100">
              <Col xl={4} lg={5} md={7} sm={10}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Card className="login-card">
                    {/* HEADER */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="login-header"
                    >
                      <FaUserLock className="login-icon" />
                      <h4>Admin Login</h4>
                      <p>Sign in to your dashboard</p>
                    </motion.div>

                    {/* FORM */}
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <div className="input-icon">
                          <FaEnvelope />
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
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
                            required
                          />
                        </div>
                      </Form.Group>

                      {/* <div className="text-end mb-3">
                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div> */}

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <NavLink
                          to="/dashboard"
                          style={{ textDecoration: "none" }}
                        >
                          <Button type="button" className="login-btn w-100">
                            Login
                          </Button>
                        </NavLink>
                      </motion.div>
                    </Form>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Login;
