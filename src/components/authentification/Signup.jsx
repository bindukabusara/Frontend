import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaStore, FaIdCard, FaEye, FaEyeSlash } from "react-icons/fa"; // Icons
import "./Signup.css"; // Import CSS file

const Signup = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pharmacyName, setPharmacyName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("patient");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
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
                phoneNumber,
            };

            if (role === "storeManager" || role === "saler") {
                userData.pharmacyName = pharmacyName;
                userData.licenseNumber = licenseNumber;
            }

            const response = await axios.post("https://backend-zltr.onrender.com/api/register", userData);

            localStorage.setItem("user", JSON.stringify({
                firstName: fname,
                lastName: lname,
                email,
                phoneNumber,
                role,
            }));

            setSuccess("Registration successful! Redirecting...");
            setError("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setSuccess("");
        }
    };

    return (
        <Container className="signup-page">
            <Row className="signup-container">
                <Col md={5} className="signup-left">
                    <h2>Get Started</h2>
                    <p>Create your account in just a few easy steps.</p>
                </Col>

                <Col md={7} className="signup-right">
                    <Form onSubmit={handleSignup} className="signup-form">
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label><FaUser className="icon" /> First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><FaUser className="icon" /> Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><FaEnvelope className="icon" /> Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><FaLock className="icon" /> Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><FaLock className="icon" /> Confirm Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><FaUser className="icon" /> Role</Form.Label>
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

                        <Form.Group className="mb-3">
                            <Form.Label><FaPhone className="icon" /> Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {(role === "storeManager" || role === "saler") && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaStore className="icon" /> Pharmacy Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter pharmacy name"
                                        value={pharmacyName}
                                        onChange={(e) => setPharmacyName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label><FaIdCard className="icon" /> License Number</Form.Label>
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
