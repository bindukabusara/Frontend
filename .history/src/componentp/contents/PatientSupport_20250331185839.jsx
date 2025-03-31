import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { FaHome, FaShoppingCart, FaBell, FaHeadset, FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import SidebarP from "../bar/SidebarP";
import NavbarP from "../bar/NavbarP";
import "./Support.css";

const PatientSupport = () => {
  return (
    <div className="dashboard-container">
      <NavbarP />
      <SidebarP />
      <div className="main-content">
        {/* Header Section */}
        <div className="support-header">
          <Container>
            <h1><FaHeadset className="support-icon" /> Patient Support Center</h1>
            <p>Get help with your medication orders and reminders</p>
          </Container>
        </div>

        {/* Quick Links Section */}
        <section className="quick-links">
          <Container>
            <h2 className="section-title">Quick Access</h2>
            <Row className="mt-4">
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaHome className="quick-link-icon" />
                    <Card.Title>Order Medications</Card.Title>
                    <Card.Text>
                      Browse and order your prescribed medications
                    </Card.Text>
                    <Button as={Link} to="/patient-dashboard" variant="primary">
                      Start Ordering
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaShoppingCart className="quick-link-icon" />
                    <Card.Title>Your Cart</Card.Title>
                    <Card.Text>
                      Review, modify, and prepare your order for delivery
                    </Card.Text>
                    <Button as={Link} to="/cart" variant="primary">
                      Go to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaBell className="quick-link-icon" />
                    <Card.Title>Medication Reminders</Card.Title>
                    <Card.Text>
                      Set up and manage your medication reminders
                    </Card.Text>
                    <Button as={Link} to="/reminder" variant="primary">
                      Manage Reminders
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Help Resources Section */}
        <section className="help-resources">
          <Container>
            <h2 className="section-title">Patient Resources</h2>
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title><FaQuestionCircle className="mr-2" /> Patient FAQ</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>How to place an order?</ListGroup.Item>
                      <ListGroup.Item>How to modify my cart?</ListGroup.Item>
                      <ListGroup.Item>How payment on delivery works?</ListGroup.Item>
                      <ListGroup.Item>How to set up medication reminders?</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaHeadset className="mr-2" /> Patient Support</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <FaPhone className="mr-2" /> Patient Hotline: +256 776 754 122
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaEnvelope className="mr-2" /> Email: flowpharmacy@gmail.com
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Support Hours:</strong> 24/7 for urgent medication needs
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button variant="outline-primary" className="mt-2">
                          Ask a Pharmacist
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Patient Guides Section */}
        <section className="video-tutorials">
          <Container>
            <h2 className="section-title">Patient Guides</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" alt="Ordering Guide" />
                  <Card.Body>
                    <Card.Title>Ordering Medications</Card.Title>
                    <Button variant="link" className="p-0">View Guide</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" alt="Payment Guide" />
                  <Card.Body>
                    <Card.Title>Payment on Delivery</Card.Title>
                    <Button variant="link" className="p-0">View Guide</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" alt="Reminders Guide" />
                  <Card.Body>
                    <Card.Title>Setting Reminders</Card.Title>
                    <Button variant="link" className="p-0">View Guide</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default PatientSupport;
