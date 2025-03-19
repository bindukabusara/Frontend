import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupP = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5009/api/register", {
                firstName: fname,
                lastName: lname,
                email,
                password,
            });

            setSuccess("Registration successful! Redirecting...");
            setError("");

            // Redirect based on role
            setTimeout(() => {
                if (role === "storeManager") {
                    navigate("/dashboard");
                } else {
                    navigate("/medications");
                }
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setSuccess("");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="shadow-lg rounded bg-white">
                <Col md={5} className="p-5 bg-light text-dark">
                    <h2 className="fw-bold">Get started as a <br /> Patient</h2>
                    <p>Create your account in just a few easy steps.</p>
                </Col>

                <Col md={7} className="p-5">
                    <Form onSubmit={handleSignup}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                required
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">Submit</Button>

                        <div className="text-center mt-3">
                            <p>Already have an account? <Link to="/loginP">Login</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignupP;
