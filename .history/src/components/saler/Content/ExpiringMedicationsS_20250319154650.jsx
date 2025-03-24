import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Alert, Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faClock, faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./ExpiringMedications.css";
import SidebarS from "../Bar/SidebarS";
import NavbarS from "../Bar/NavbarS";


const ExpiringMedications = () => {
  const [expiredMedications, setExpiredMedications] = useState([]);
  const [expiringSoonMedications, setExpiringSoonMedications] = useState([]);
  const [expiringInThreeMonthsMedications, setExpiringInThreeMonthsMedications] = useState([]);
  const [error, setError] = useState("");
  const [showExpiredTable, setShowExpiredTable] = useState(false);
  const [showExpiringSoonTable, setShowExpiringSoonTable] = useState(false);
  const [showExpiringInThreeMonthsTable, setShowExpiringInThreeMonthsTable] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchExpiringMedications();
  }, []);

  const fetchExpiringMedications = async () => {
    try {
      const expiredResponse = await axios.get("https://backend-zltr.onrender.com/api/expired");
      const expiringSoonResponse = await axios.get("https://backend-zltr.onrender.com/api/expiring-soon");
      const expiringInThreeMonthsResponse = await axios.get("https://backend-zltr.onrender.com/api/expiring-in-three-months");

      setExpiredMedications(expiredResponse.data);
      setExpiringSoonMedications(expiringSoonResponse.data);
      setExpiringInThreeMonthsMedications(expiringInThreeMonthsResponse.data);
    } catch (err) {
      setError("Failed to fetch expiring medications");
      console.error(err); // Log the error for debugging
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://backend-zltr.onrender.com/api/by-expire-date?date=${searchDate}`);
      setSearchResults(response.data);
    } catch (err) {
      setError("Failed to fetch medications by expire date");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="expiring-medications-container">
      <NavbarS />
      <SidebarS />

      <div className="main-content">
      <br></br><br></br>
        <Container>
          <h2>Expiring Medications</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Search Bar */}
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group controlId="searchDate">
                <Form.Label>Search by Expire Date</Form.Label>
                <Form.Control
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className="button-icon" />
                Search
              </Button>
            </Col>
          </Row>

          {/* Search Results Table */}
          {searchResults.length > 0 && (
            <Row className="mt-4">
              <Col>
                <h3>Medications Expiring on {new Date(searchDate).toLocaleDateString()}</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Expire Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((medication) => (
                      <tr key={medication._id}>
                        <td>
                          <img
                            src={`http://localhost:5009/uploads/${medication.image}`}
                            alt={medication.name}
                            className="medication-image"
                          />
                        </td>
                        <td>{medication.name}</td>
                        <td>{medication.description}</td>
                        <td>{medication.quantity}</td>
                        <td>{medication.price}</td>
                        <td>{new Date(medication.expireDate).toLocaleDateString()}</td>
                        <td>{medication.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}

          {/* Buttons for Expired, Expiring Soon, and Expiring in Three Months */}
          <Row className="mt-4">
            <Col md={4}>
              <Card className="expired-card">
                <Card.Body>
                  <Button
                    className="custom-button"
                    onClick={() => setShowExpiredTable(!showExpiredTable)}
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} className="button-icon" />
                    Expired Medications
                  </Button>
                  <p className="mt-2">
                    Medications that have already expired. Please remove or replace them.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="expiring-soon-card">
                <Card.Body>
                  <Button
                    className="custom-button"
                    onClick={() => setShowExpiringSoonTable(!showExpiringSoonTable)}
                  >
                    <FontAwesomeIcon icon={faClock} className="button-icon" />
                    Expires Soon
                  </Button>
                  <p className="mt-2">
                    Medications that will expire in less than one week. Take action soon.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="expiring-three-months-card">
                <Card.Body>
                  <Button
                    className="custom-button"
                    onClick={() => setShowExpiringInThreeMonthsTable(!showExpiringInThreeMonthsTable)}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="button-icon" />
                    Expires in 3 Months
                  </Button>
                  <p className="mt-2">
                    Medications that will expire in less than three months. Monitor them.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Expired Medications Table */}
          {showExpiredTable && (
            <Row className="mt-4">
              <Col>
                <h3>Expired Medications</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Expire Date</th>
                      <th>location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiredMedications.map((medication) => (
                      <tr key={medication._id}>
                        <td>
                          <img
                            src={`http://localhost:5009/uploads/${medication.image}`}
                            alt={medication.name}
                            className="medication-image"
                          />
                        </td>
                        <td>{medication.name}</td>
                        <td>{medication.description}</td>
                        <td>{medication.quantity}</td>
                        <td>{medication.price}</td>
                        <td>{new Date(medication.expireDate).toLocaleDateString()}</td>
                        <td>{medication.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}

          {/* Expiring in Less Than One Week Table */}
          {showExpiringSoonTable && (
            <Row className="mt-4">
              <Col>
                <h3>Expiring in Less Than 1 Week</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Expire Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringSoonMedications.map((medication) => (
                      <tr key={medication._id}>
                        <td>
                          <img
                            src={`http://localhost:5009/uploads/${medication.image}`}
                            alt={medication.name}
                            className="medication-image"
                          />
                        </td>
                        <td>{medication.name}</td>
                        <td>{medication.description}</td>
                        <td>{medication.quantity}</td>
                        <td>{medication.price}</td>
                        <td>{new Date(medication.expireDate).toLocaleDateString()}</td>
                        <td>{medication.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}

          {/* Expiring in Less Than Three Months Table */}
          {showExpiringInThreeMonthsTable && (
            <Row className="mt-4">
              <Col>
                <h3>Expiring in Less Than 3 Months</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Expire Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringInThreeMonthsMedications.map((medication) => (
                      <tr key={medication._id}>
                        <td>
                          <img
                            src={`http://localhost:5009/uploads/${medication.image}`}
                            alt={medication.name}
                            className="medication-image"
                          />
                        </td>
                        <td>{medication.name}</td>
                        <td>{medication.description}</td>
                        <td>{medication.quantity}</td>
                        <td>{medication.price}</td>
                        <td>{new Date(medication.expireDate).toLocaleDateString()}</td>
                        <td>{medication.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ExpiringMedications;
