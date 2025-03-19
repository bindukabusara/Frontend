import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import "./MedicationStore.css";
import Navbar from "../Pharmacy/Sidebar/Navbar";

const MedicationStore = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expireDate, setExpireDate] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of items per page
  const [notification, setNotification] = useState(""); // Notification state

  useEffect(() => {
    fetchMedications();
    fetchOrders(); // Fetch orders when the component mounts
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
      setError("Failed to fetch medications");
    }
  };

  // Fetch orders to check for new notifications
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5009/api/orders");
      if (response.data.length > 0) {
        setNotification("New order placed!");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  // Handle form submission for adding/editing medication
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("expireDate", expireDate);
    formData.append("location", location);

    try {
      if (editId) {
        await axios.put(`http://localhost:5009/api/medications/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Medication updated successfully");
      } else {
        await axios.post("http://localhost:5009/api/medications", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Medication added successfully");
      }
      fetchMedications(); // Refresh the list after adding/editing
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError("Failed to save medication");
    }
  };

  // Handle editing a medication
  const handleEdit = (medication) => {
    setName(medication.name);
    setDescription(medication.description);
    setQuantity(medication.quantity);
    setPrice(medication.price);
    setImage(medication.image);
    setExpireDate(medication.expireDate);
    setLocation(medication.location);
    setEditId(medication._id);
    setShowModal(true);
  };

  // Handle deleting a medication
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5009/api/medications/${id}`);
      setSuccess("Medication deleted successfully");
      fetchMedications(); // Refresh the list after deletion
    } catch (err) {
      setError("Failed to delete medication");
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setImage(null);
    setExpireDate("");
    setLocation("");
    setEditId(null);
  };

  // Open the modal for adding a new medication
  const handleAddMedication = () => {
    resetForm();
    setShowModal(true);
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
          {/* Notification Alert */}
          {notification && (
            <Alert variant="info" onClose={() => setNotification("")} dismissible>
              {notification}
            </Alert>
          )}

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
            <Col md={6} className="text-end">
              <Button variant="primary" onClick={handleAddMedication}>
                <strong>Add Medication</strong>
              </Button>
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
                    <th>Actions</th>
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
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant="warning"
                            onClick={() => handleEdit(medication)}
                            style={{ padding: "5px 10px" }}
                          >
                            <FaEdit style={{ color: "#fff" }} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(medication._id)}
                            style={{ padding: "5px 10px" }}
                          >
                            <FaTrash style={{ color: "#fff" }} />
                          </Button>
                        </div>
                      </td>
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>{editId ? "Edit Medication" : "Add Medication"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expire Date</Form.Label>
              <Form.Control
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editId ? "Update" : "Save"} Medication
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MedicationStore;
