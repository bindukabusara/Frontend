import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { FaHome, FaClock, FaStore, FaClipboardList, FaChartBar, FaHeadset, FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import SidebarS from "../Bar/SidebarS";
import NavbarS from "../Bar/NavbarS";
import "./Support.css";

const SalesSupport = () => {
  return (
    <div className="dashboard-container">
      <NavbarS />
      <SidebarS />
      <div className="main-content">
        {/* Header Section */}
        <div className="support-header">
          <Container>
            <h1><FaHeadset className="support-icon" /> Sales Support Center</h1>
            <p>Resources for sales team members</p>
          </Container>
        </div>

        {/* Quick Links Section */}
        <section className="quick-links">
          <Container>
            <h2 className="section-title">Your Quick Access</h2>
            <Row className="mt-4">
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaHome className="quick-link-icon" />
                    <Card.Title>Dashboard</Card.Title>
                    <Card.Text>
                      View sales metrics and pharmacy overview
                    </Card.Text>
                    <Button as={Link} to="/dashboard" variant="primary">
                      Go to Dashboard
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaClock className="quick-link-icon" />
                    <Card.Title>Expiring Medications</Card.Title>
                    <Card.Text>
                      View medications nearing expiration (read-only)
                    </Card.Text>
                    <Button as={Link} to="/expiring-medication" variant="primary">
                      View Expiring
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaStore className="quick-link-icon" />
                    <Card.Title>Store Inventory</Card.Title>
                    <Card.Text>
                      View current stock levels (read-only)
                    </Card.Text>
                    <Button as={Link} to="/store" variant="primary">
                      View Inventory
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaClipboardList className="quick-link-icon" />
                    <Card.Title>Orders</Card.Title>
                    <Card.Text>
                      View and track customer orders
                    </Card.Text>
                    <Button as={Link} to="/orders" variant="primary">
                      View Orders
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="quick-link-card">
                  <Card.Body className="text-center">
                    <FaChartBar className="quick-link-icon" />
                    <Card.Title>Sales Reports</Card.Title>
                    <Card.Text>
                      Generate and view sales performance reports
                    </Card.Text>
                    <Button as={Link} to="/reports" variant="primary">
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
            <h2 className="section-title">Sales Team Resources</h2>
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title><FaQuestionCircle className="mr-2" /> Sales FAQ</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>How to check order status?</ListGroup.Item>
                      <ListGroup.Item>How to view inventory levels?</ListGroup.Item>
                      <ListGroup.Item>How to generate sales reports?</ListGroup.Item>
                      <ListGroup.Item>How to identify expiring medications?</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Card.Title><FaHeadset className="mr-2" /> Sales Support</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <FaPhone className="mr-2" /> Sales Hotline: +1 (555) 987-6543
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaEnvelope className="mr-2" /> Email: sales-support@flowpharmacy.com
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Support Hours:</strong> Mon-Sat, 8AM-8PM EST
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button variant="outline-primary" className="mt-2">
                          Request Sales Assistance
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sales Training Section */}
        <section className="video-tutorials">
          <Container>
            <h2 className="section-title">Sales Training Materials</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Order Processing Guide</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Inventory Lookup</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title>Sales Reporting</Card.Title>
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

export default SalesSupport;
