import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pharmacyName, setPharmacyName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("patient"); // Default role
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
            const userData = {
                firstName: fname,
                lastName: lname,
                email,
                password,
                role,
                phoneNumber, // Include phoneNumber for all roles
            };

            // Add pharmacy-specific fields only if the role is "storeManager" or "saler"
            if (role === "storeManager" || role === "saler") {
                userData.pharmacyName = pharmacyName;
                userData.licenseNumber = licenseNumber;
            }

            const response = await axios.post("https://backend-zltr.onrender.com/api/register", userData);

            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify({
                firstName: fname,
                lastName: lname,
                email,
                phoneNumber,
                role,
            }));

            setSuccess("Registration successful! Redirecting...");
            setError("");

            // Redirect based on role
            setTimeout(() => {
                if (role === "storeManager") {
                    navigate("/login");
                } else if (role === "saler") {
                    navigate("/login");
                } else if (role === "patient") {
                    navigate("/login"); // Redirect to patient dashboard
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
                    <h2 className="fw-bold">Get started</h2>
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

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="patient">Patient</option>
                                <option value="storeManager">Store Manager</option>
                                <option value="saler">Saler</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Phone Number Field (Required for all roles) */}
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Pharmacy-specific fields (only shown for storeManager and saler) */}
                        {(role === "storeManager" || role === "saler") && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pharmacy Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter pharmacy name"
                                        value={pharmacyName}
                                        onChange={(e) => setPharmacyName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>License Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter license number"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Button type="submit" variant="primary" className="w-100">Submit</Button>

                        <div className="text-center mt-3">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
