import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import "./MedicationStore.css";
import Navbar from "../Pharmacy/Sidebar/Navbar";

const MedicationStore = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    fetchMedications();
  }, []);

  // Fetch all medications and filter out expired ones
  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://localhost:5009/api/medications");
      const currentDate = new Date();

      // Filter out expired medications
      const validMedications = response.data.filter(
        (medication) => new Date(medication.expireDate) > currentDate
      );

      setMedications(validMedications);
      setFilteredMedications(validMedications); // Initialize filtered medications with valid medications
    } catch (err) {
      console.error("Failed to fetch medications", err);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter medications based on the search query
    const filtered = medications.filter((medication) =>
      medication.name.toLowerCase().includes(query)
    );
    setFilteredMedications(filtered); // Update filtered medications
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedications.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="medication-store-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <Row className="mt-5 align-items-center">
            <h3>Store</h3>
            <Col md={6}>
              <div className="search-bar">
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table striped bordered hover className="custom-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Expire Date</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((medication) => (
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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="secondary"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="mx-3 align-self-center">
                  Page {currentPage} of {Math.ceil(filteredMedications.length / itemsPerPage)}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredMedications.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MedicationStore;
