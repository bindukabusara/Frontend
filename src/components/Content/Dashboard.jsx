import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"; // Import recharts components
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import Navbar from "../Pharmacy/Sidebar/Navbar";
import "./Dashboard.css";
import { FaPills, FaExclamationTriangle, FaCalendarTimes } from "react-icons/fa"; // Import icons

const Dashboard = () => {
  const [totalMedications, setTotalMedications] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expiredMedications, setExpiredMedications] = useState(0);
  const [expiringInThreeMonths, setExpiringInThreeMonths] = useState(0); // Add state for expiring in 3 months
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total medications
      const totalResponse = await axios.get("https://backend-zltr.onrender.com/api/medications");
      setTotalMedications(totalResponse.data.length);

      // Fetch medications expiring soon (less than 1 week)
      const expiringSoonResponse = await axios.get("https://backend-zltr.onrender.com/api/expiring-soon");
      setExpiringSoon(expiringSoonResponse.data.length);

      // Fetch expired medications
      const expiredResponse = await axios.get("https://backend-zltr.onrender.com/api/expired");
      setExpiredMedications(expiredResponse.data.length);

      // Fetch medications expiring in 3 months
      const expiringInThreeMonthsResponse = await axios.get("https://backend-zltr.onrender.com/expiring-in-three-months");
      setExpiringInThreeMonths(expiringInThreeMonthsResponse.data.length);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err.response?.data || err.message);
    }
  };

  // Data for the bar chart
  const chartData = [
    { name: "Expired", Medications: expiredMedications },
    { name: "Expiring Soon", Medications: expiringSoon },
    { name: "Expiring in 3 Months", Medications: expiringInThreeMonths },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <br></br><br></br><br></br>
          <h2>Pharmacy Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Key Metrics Cards */}
          <Row className="mt-4">
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>
                    <FaPills className="card-icon" /> Total medication
                  </Card.Title>
                  <Card.Text className="card-value">{totalMedications}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card expire">
                <Card.Body>
                  <Card.Title>
                    <FaExclamationTriangle className="card-ico" /> Expires soon
                  </Card.Title>
                  <Card.Text className="card-value">{expiringSoon}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card expired">
                <Card.Body>
                  <Card.Title>
                    <FaCalendarTimes className="card-ic" /> Expired medication
                  </Card.Title>
                  <Card.Text className="card-value">{expiredMedications}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Analytics Graph */}
          <Row className="mt-5">
            <Col>
              <Card className="p-3">
                <h4>Expiring Medications Analytics</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Medications" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
