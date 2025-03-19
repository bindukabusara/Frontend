import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../Pharmacy/Sidebar/sidebar";
import "./Inventory.css";

const Inventory = () => {
  const [medications, setMedications] = useState([]);
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

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://localhost:5009/api/medications");
      setMedications(response.data);
    } catch (err) {
      setError("Failed to fetch medications");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5009/api/medications/search?query=${searchQuery}`);
      setMedications(response.data);
    } catch (err) {
      setError("Failed to search medications");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("expireDate", expireDate);

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
      fetchMedications();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError("Failed to save medication");
    }
  };

  const handleEdit = (medication) => {
    setName(medication.name);
    setDescription(medication.description);
    setQuantity(medication.quantity);
    setPrice(medication.price);
    setImage(medication.image);
    setExpireDate(medication.expireDate);
    setEditId(medication._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5009/api/medications/${id}`);
      setSuccess("Medication deleted successfully");
      fetchMedications();
    } catch (err) {
      setError("Failed to delete medication");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setImage(null);
    setExpireDate("");
    setEditId(null);
  };

  const handleAddMedication = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="inventory-container">
      <Sidebar />
      <div className="main-content">
        <Container>
          <Row className="mt-5 align-items-center">
            <Col md={6}>
              <div className="search-bar">
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="primary" onClick={handleAddMedication}>
                Add Medication
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
                    <th>Price</th>
                    <th>Expire Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
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
              <Form.Label>Price</Form.Label>
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
                required={!editId}
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
            <Button type="submit" variant="primary">
              {editId ? "Update" : "Save"} Medication
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Inventory;
