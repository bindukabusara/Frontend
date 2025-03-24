import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Alert, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell, PieChart, Pie } from "recharts";
import SidebarS from "../Bar/SidebarS";
import NavbarS from "../Bar/NavbarS";
import "./Report.css"; // Custom CSS for the report page

const ReportPage = () => {
  const [totalMedications, setTotalMedications] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expiredMedications, setExpiredMedications] = useState(0);
  const [expiringInThreeMonths, setExpiringInThreeMonths] = useState(0);
  const [lowQuantityMedications, setLowQuantityMedications] = useState(0);
  const [nonExpiredMedicationsInStock, setNonExpiredMedicationsInStock] = useState(0);
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [expiredByMonth, setExpiredByMonth] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReportData();
    fetchExpiredByMonth(year);
  }, [year]);

  const fetchReportData = async () => {
    try {
      const totalResponse = await axios.get("https://backend-zltr.onrender.com/api/medications");
      setTotalMedications(totalResponse.data.length);

      const expiringSoonResponse = await axios.get("https://backend-zltr.onrender.com/api/expiring-soon");
      setExpiringSoon(expiringSoonResponse.data.length);

      const expiredResponse = await axios.get("https://backend-zltr.onrender.com/api/expired");
      setExpiredMedications(expiredResponse.data.length);

      const expiringInThreeMonthsResponse = await axios.get("https://backend-zltr.onrender.com/api/expiring-in-three-months");
      setExpiringInThreeMonths(expiringInThreeMonthsResponse.data.length);

      const lowQuantityResponse = await axios.get("https://backend-zltr.onrender.com/api/low-quantity");
      setLowQuantityMedications(lowQuantityResponse.data.length);

      const nonExpiredInStockResponse = await axios.get("https://backend-zltr.onrender.com/api/non-expired-in-stock");
      setNonExpiredMedicationsInStock(nonExpiredInStockResponse.data.length);
    } catch (err) {
      setError("Failed to fetch report data");
      console.error("Error fetching report data:", err.response?.data || err.message);
    }
  };

  const fetchExpiredByMonth = async (year) => {
    try {
      const response = await axios.get(`https://backend-zltr.onrender.com/api/expired-by-month?year=${year}`);
      if (response.data && Array.isArray(response.data)) {
        setExpiredByMonth(response.data);
      } else {
        setError("Invalid data format received from the server");
        console.error("Invalid data format:", response.data);
      }
    } catch (err) {
      setError("Failed to fetch expired medications by month");
      console.error("Error fetching expired medications by month:", err.response?.data || err.message);
    }
  };

  const fetchMedicationsByCategory = async (category) => {
    try {
      let endpoint = "";
      switch (category) {
        case "Total Medications":
          endpoint = "https://backend-zltr.onrender.com/api/medications";
          break;
        case "Expiring Soon":
          endpoint = "https://backend-zltr.onrender.com/api/expiring-soon";
          break;
        case "Expired Medications":
          endpoint = "https://backend-zltr.onrender.com/api/expired";
          break;
        case "Expiring in 3 Months":
          endpoint = "https://backend-zltr.onrender.com/api/expiring-in-three-months";
          break;
        case "Low Quantity Medications":
          endpoint = "https://backend-zltr.onrender.com/api/low-quantity";
          break;
        case "Non-Expired Medications in Stock":
          endpoint = "https://backend-zltr.onrender.com/api/non-expired-in-stock";
          break;
        default:
          break;
      }

      const response = await axios.get(endpoint);
      console.log("API Response:", response.data); // Log the API response
      setSelectedMedications(response.data);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch medications");
      console.error("Error fetching medications:", err.response?.data || err.message);
    }
  };

  const handlePrintMedications = () => {
    const printContent = document.getElementById("medications-to-print").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the original content
  };

  const expiredChartData = expiredByMonth.map((medication) => ({
    name: new Date(0, medication.month - 1).toLocaleString("default", { month: "long" }),
    Medications: medication.count,
  }));

  const maxLossMonth = expiredChartData.reduce((max, data) => (data.Medications > max.Medications ? data : max), expiredChartData[0]);

  const pieChartData = [
    { name: "Expired", value: expiredMedications, fill: "#ff4d4d" },
    { name: "Expiring Soon", value: expiringSoon, fill: "#ffa64d" },
    { name: "Expiring in 3 Months", value: expiringInThreeMonths, fill: "#ffd24d" },
    { name: "Safe", value: totalMedications - (expiredMedications + expiringSoon + expiringInThreeMonths), fill: "#4dff4d" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-page-container">
      <NavbarS />
      <SidebarS />
      <div className="main-content">
        <Container>
          <h2>Pharmacy Report</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Key Metrics Cards */}
          <Row className="mt-4">
            {/* Total Medications Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Total Medications</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#e3f2fd" }}>
                  <Card.Text className="card-value">{totalMedications}</Card.Text>
                </div>
              </Card>
            </Col>

            {/* Expiring Soon Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Expiring in one week</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#fff3e0" }}>
                  <Card.Text className="card-value">{expiringSoon}</Card.Text>
                </div>
              </Card>
            </Col>

            {/* Expired Medications Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Expired Medications</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#ffebee" }}>
                  <Card.Text className="card-value">{expiredMedications}</Card.Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            {/* Expiring in 3 Months Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Expiring in 3 Months</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#f0f4c3" }}>
                  <Card.Text className="card-value">{expiringInThreeMonths}</Card.Text>
                </div>
              </Card>
            </Col>

            {/* Low Quantity Medications Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Insufficient volume</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#fce4ec" }}>
                  <Card.Text className="card-value">{lowQuantityMedications}</Card.Text>
                </div>
              </Card>
            </Col>

            {/* Non-Expired Medications in Stock Card */}
            <Col md={4}>
              <Card className="report-card">
                <div className="card-title-section">
                  <Card.Title>Current medications</Card.Title>
                </div>
                <div className="card-value-section" style={{ backgroundColor: "#4CAF50" }}>
                  <Card.Text className="card-value">{nonExpiredMedicationsInStock}</Card.Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Year Selection */}
          <Row className="mt-4">
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
            <Col md={12}>
              <Card className="p-3 graph-card">
                <h4>Expired Medications in {year}</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={expiredChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Medications" fill="#ff4d4d">
                      {expiredChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === maxLossMonth.name ? "#ff1a1a" : "#ff4d4d"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Pie Chart for Medication Status Distribution */}
            <Col md={12}>
              <Card className="p-3 graph-card">
                <h4>Medication Status Distribution</h4>
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Detailed Table */}
          <Row className="mt-5">
            <Col>
              <Card className="p-3 detailed-report-card">
                <h4>Detailed Medication Report</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Medications</td>
                      <td>{totalMedications}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Total Medications")}>
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Expiring Soon (Less than 1 week)</td>
                      <td>{expiringSoon}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Expiring Soon")}>
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Expired Medications</td>
                      <td>{expiredMedications}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Expired Medications")}>
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Expiring in 3 Months</td>
                      <td>{expiringInThreeMonths}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Expiring in 3 Months")}>
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Low Quantity Medications</td>
                      <td>{lowQuantityMedications}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Low Quantity Medications")}>
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Non-Expired Medications in Stock</td>
                      <td>{nonExpiredMedicationsInStock}</td>
                      <td>
                        <Button variant="info" onClick={() => fetchMedicationsByCategory("Non-Expired Medications in Stock")}>
                          View
                        </Button>
                      </td>
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

      {/* Modal to Display Medications */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Medications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="medications-to-print">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Expiration Date</th>
                </tr>
              </thead>
              <tbody>
          {selectedMedications.map((medication, index) => (
            <tr key={index}>
              <td>{medication.name}</td>
              <td>{medication.quantity}</td>
              <td>{new Date(medication.expireDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrintMedications}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportPage;
