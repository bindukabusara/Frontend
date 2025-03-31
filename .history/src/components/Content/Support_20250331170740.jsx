import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { FaHome, FaClock, FaBoxes, FaChartBar, FaHeadset, FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import Navbar from "../Pharmacy/Sidebar/Navbar";
import "./Support.css";

const Support = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        {/* Header Section */}
        <div className="support-header">
          <Container>
            <h1><FaHeadset className="support-icon" /> FLOW+ Support Center</h1>
            <p>Get help with your pharmacy management system</p>
          </Container>
        </div>

        {/* Quick Links Section */}
        <section className="quick-links">
          <Container>
            <h2 className="section-title">Quick Access</h2>
            <Row className="mt-4">
              <Col md={3} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaHome className="quick-link-icon" />
                    <Card.Title>Dashboard</Card.Title>
                    <Card.Text>
                      View your pharmacy key metrics and analytics
                    </Card.Text>
                    <Button as={Link} to="/dashboard" variant="primary">
                      Go to Dashboard
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaClock className="quick-link-icon" />
                    <Card.Title>Expiring Tracking</Card.Title>
                    <Card.Text>
                      Monitor medications nearing expiration
                    </Card.Text>
                    <Button as={Link} to="/expiring-medications" variant="primary">
                      Track Expiry
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaBoxes className="quick-link-icon" />
                    <Card.Title>Stock Management</Card.Title>
                    <Card.Text>
                      Manage your medication inventory (CRUD)
                    </Card.Text>
                    <Button as={Link} to="/medications" variant="primary">
                      Manage Stock
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaChartBar className="quick-link-icon" />
                    <Card.Title>Reports</Card.Title>
                    <Card.Text>
                      Generate detailed pharmacy reports
                    </Card.Text>
                    <Button as={Link} to="/reportP" variant="primary">
                      View Reports
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
            <h2 className="section-title">Help Resources</h2>
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title><FaQuestionCircle className="mr-2" /> Frequently Asked Questions</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>How to add new medications?</ListGroup.Item>
                      <ListGroup.Item>How to set up expiry alerts?</ListGroup.Item>
                      <ListGroup.Item>How to generate reports?</ListGroup.Item>
                      <ListGroup.Item>How to manage user permissions?</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaHeadset className="mr-2" /> Contact Support</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <FaPhone className="mr-2" /> Support Hotline: +256 776754122
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaEnvelope className="mr-2" /> Email: support@flowpharmacy.com
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Business Hours:</strong> Mon-Fri, 8AM-6PM EST
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button variant="outline-primary" className="mt-2">
                          Open Support Ticket
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Video Tutorials Section */}
        <section className="video-tutorials">
          <Container>
            <h2 className="section-title">Video Tutorials</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Getting Started with FLOW+</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Stock Management Guide</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Generating Reports</Card.Title>
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

export default Support;
