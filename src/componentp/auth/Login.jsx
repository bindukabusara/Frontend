import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginP = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5009/api/loginP", {
                email,
                password,
            });

            setSuccess("Login successful! Redirecting...");
            setError("");

            // Redirect to patient dashboard
            setTimeout(() => navigate("/dash"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setSuccess("");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="shadow-lg rounded bg-white">
                <Col md={5} className="p-5 bg-light text-dark">
                    <h2 className="fw-bold">Welcome Back!</h2>
                    <p>Login to access your account.</p>
                </Col>

                <Col md={7} className="p-5">
                    <Form onSubmit={handleLogin}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">Login</Button>

                        <div className="text-center mt-3">
                            <p>Don't have an account? <Link to="/sign">Sign Up</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginP;
