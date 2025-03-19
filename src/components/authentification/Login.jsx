import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://backend-zltr.onrender.com/api/login", {
                email,
                password,
            });

            // Store token and user info in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Clear local cart state
            localStorage.removeItem("cart");

            // Redirect based on role
            if (response.data.user.role === "storeManager") {
                navigate("/dashboard");
            } else if (response.data.user.role === "saler") {
                navigate("/store");
            } else if (response.data.user.role === "patient") {
                navigate("/dash");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="shadow-lg rounded bg-white">
                <Col md={5} className="p-5 bg-light text-dark">
                    <h2 className="fw-bold">Welcome back</h2>
                    <p>Log in to your account to continue.</p>
                </Col>

                <Col md={7} className="p-5">
                    <Form onSubmit={handleLogin}>
                        {error && <Alert variant="danger">{error}</Alert>}

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
                            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
