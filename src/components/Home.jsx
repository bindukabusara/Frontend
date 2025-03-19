import React from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import { FaPills, FaClock, FaUserMd, FaChartLine } from "react-icons/fa"; // Icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css"; // Custom CSS for styling
import logo from './Pharmacy/Sidebar/Logo.png'; // Replace with your logo path

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle "Get Started" button click
  const handleGetStarted = () => {
    navigate("/register"); // Navigate to the register page
  };

  // Function to handle "Sign In" button click
  const handleSignIn = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo} // Replace with your logo
              alt="FLOW+ Logo"
              className="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className="nav-link">
                Home
              </Nav.Link>
              <Nav.Link href="#features" className="nav-link">
                Features
              </Nav.Link>
              <Nav.Link href="#about" className="nav-link">
                About
              </Nav.Link>
              <Nav.Link href="#contact" className="nav-link">
                Contact
              </Nav.Link>
              <Button
                variant="outline-primary"
                className="nav-button"
                onClick={handleSignIn} // Add onClick handler
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                className="nav-button ms-2"
                onClick={handleGetStarted} // Add onClick handler
              >
                Get Started
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section"><br></br><br></br><br></br><br></br>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">
                Welcome to <span className="brand-name">FLOW+</span>
              </h1>
              <p className="hero-subtitle">
                Your modern pharmacy management solution. Simplify operations, track medications, and enhance patient care.
              </p>
              <Button variant="primary" size="lg" className="cta-button">
                Explore Features
              </Button>
            </Col>
            <Col md={6}>
              <img
                src={logo} // Replace with your hero image
                alt="Pharmacy Management"
                className="img-fluid hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title text-center">Why Choose FLOW+?</h2>
          <Row className="mt-5">
            <Col md={3} className="text-center">
              <Card className="feature-card h-100">
                <Card.Body>
                  <FaPills className="feature-icon" />
                  <h3 className="feature-title">Medication Tracking</h3>
                  <p className="feature-description">
                    Easily manage and track all your medications in one place.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="text-center">
              <Card className="feature-card h-100">
                <Card.Body>
                  <FaClock className="feature-icon" />
                  <h3 className="feature-title">Expiry Alerts</h3>
                  <p className="feature-description">
                    Get notified about expiring medications to avoid waste.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="text-center">
              <Card className="feature-card h-100">
                <Card.Body>
                  <FaUserMd className="feature-icon" />
                  <h3 className="feature-title">Patient Management</h3>
                  <p className="feature-description">
                    Manage patient records and prescriptions seamlessly.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="text-center">
              <Card className="feature-card h-100">
                <Card.Body>
                  <FaChartLine className="feature-icon" />
                  <h3 className="feature-title">Sales Analytics</h3>
                  <p className="feature-description">
                    Gain insights into your sales and inventory performance.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="cta-title">Ready to Transform Your Pharmacy?</h2>
              <p className="cta-subtitle">
                Join FLOW+ today and experience the future of pharmacy management.
              </p>
              <Button variant="primary" size="lg" className="cta-button">
                Sign Up Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="footer-text">
                &copy; {new Date().getFullYear()} FLOW+ for Pharmacy. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
