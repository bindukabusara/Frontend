import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Alert, Form } from "react-bootstrap";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import Navbar from "../Pharmacy/Sidebar/Navbar";
import "./Report.css"; // Custom CSS for the report page

const ReportPage = () => {
  const [totalMedications, setTotalMedications] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expiredMedications, setExpiredMedications] = useState(0);
  const [expiringInThreeMonths, setExpiringInThreeMonths] = useState(0);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [expiredByMonth, setExpiredByMonth] = useState([]); // Data for expired medications by month

  useEffect(() => {
    fetchReportData();
    fetchExpiredByMonth(month, year); // Fetch expired medications for the selected month and year
  }, [month, year]);

  const fetchReportData = async () => {
    try {
      // Fetch total medications
      const totalResponse = await axios.get("http://localhost:5009/api/medications");
      setTotalMedications(totalResponse.data.length);

      // Fetch medications expiring soon (less than 1 week)
      const expiringSoonResponse = await axios.get("http://localhost:5009/api/expiring-soon");
      setExpiringSoon(expiringSoonResponse.data.length);

      // Fetch expired medications
      const expiredResponse = await axios.get("http://localhost:5009/api/expired");
      setExpiredMedications(expiredResponse.data.length);

      // Fetch medications expiring in 3 months
      const expiringInThreeMonthsResponse = await axios.get("http://localhost:5009/api/expiring-in-three-months");
      setExpiringInThreeMonths(expiringInThreeMonthsResponse.data.length);
    } catch (err) {
      setError("Failed to fetch report data");
      console.error("Error fetching report data:", err.response?.data || err.message);
    }
  };

  // Fetch expired medications by month and year
  const fetchExpiredByMonth = async (month, year) => {
    try {
      const response = await axios.get(`http://localhost:5009/api/expired-by-month?month=${month}&year=${year}`);
      setExpiredByMonth(response.data);
    } catch (err) {
      setError("Failed to fetch expired medications by month");
      console.error("Error fetching expired medications by month:", err.response?.data || err.message);
    }
  };

  // Data for the bar chart (expired medications by month)
  const expiredChartData = expiredByMonth.map((medication) => ({
    name: new Date(medication.expireDate).toLocaleDateString(),
    Medications: medication.count,
  }));

  // Function to handle printing the report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-page-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <br></br><br></br><br></br>
          <h2>Pharmacy Report</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Key Metrics Cards */}
          <Row className="mt-4">
            <Col md={3}>
              <Card className="report-card">
                <Card.Body>
                  <Card.Title>Total Medications</Card.Title>
                  <Card.Text className="card-value">{totalMedications}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="report-card">
                <Card.Body>
                  <Card.Title>Expiring Soon</Card.Title>
                  <Card.Text className="card-value">{expiringSoon}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="report-card">
                <Card.Body>
                  <Card.Title>Expired Medications</Card.Title>
                  <Card.Text className="card-value">{expiredMedications}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="report-card">
                <Card.Body>
                  <Card.Title>Expiring in 3 Months</Card.Title>
                  <Card.Text className="card-value">{expiringInThreeMonths}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Month and Year Selection */}
          <Row className="mt-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Select Month</Form.Label>
                <Form.Control
                  as="select"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Select Year</Form.Label>
                <Form.Control
                  as="select"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Expired Medications by Month Graph */}
          <Row className="mt-5">
            <Col>
              <Card className="p-3">
                <h4>Expired Medications in {new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" })}</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={expiredChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Medications" fill="#ff4d4d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Detailed Table */}
          <Row className="mt-5">
            <Col>
              <Card className="p-3">
                <h4>Detailed Medication Report</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Medications</td>
                      <td>{totalMedications}</td>
                    </tr>
                    <tr>
                      <td>Expiring Soon (Less than 1 week)</td>
                      <td>{expiringSoon}</td>
                    </tr>
                    <tr>
                      <td>Expired Medications</td>
                      <td>{expiredMedications}</td>
                    </tr>
                    <tr>
                      <td>Expiring in 3 Months</td>
                      <td>{expiringInThreeMonths}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>

          {/* Print Button */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button variant="primary" onClick={handlePrint}>
                Print Report
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ReportPage;
