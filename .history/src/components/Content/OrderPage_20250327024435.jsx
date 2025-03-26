import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Pharmacy/Sidebar/sidebar";
import Navbar from "../Pharmacy/Sidebar/Navbar";
import "./order.css";
import "./MedicationStore.css";

const AllCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCart, setSelectedCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [timesToTake, setTimesToTake] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all carts with authentication
  const fetchCarts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://backend-zltr.onrender.com/api/cart/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCarts(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to fetch carts");
      }
      console.error("Error fetching carts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // Group carts by user
  const groupCartsByUser = () => {
    const groupedCarts = {};

    carts.forEach((cart) => {
      const userId = cart.userId?._id || "unknown";
      if (!groupedCarts[userId]) {
        groupedCarts[userId] = {
          user: cart.userId,
          carts: [],
        };
      }
      groupedCarts[userId].carts.push(cart);
    });

    return groupedCarts;
  };

  // Handle opening the View Details modal
  const handleViewDetails = (cart) => {
    setSelectedCart(cart);
    setInstructions(cart.instructions || "");
    setAdditionalNotes(cart.additionalNotes || "");
    setTimesToTake(cart.timesToTake?.length > 0 ? [...cart.timesToTake] : [""]);
    setShowModal(true);
  };

  // Handle adding a new time input field
  const handleAddTime = () => {
    setTimesToTake([...timesToTake, ""]);
  };

  // Handle removing a time input field
  const handleRemoveTime = (index) => {
    const updatedTimes = [...timesToTake];
    updatedTimes.splice(index, 1);
    setTimesToTake(updatedTimes);
  };

  // Handle updating a specific time
  const handleTimeChange = (index, value) => {
    const updatedTimes = [...timesToTake];
    updatedTimes[index] = value;
    setTimesToTake(updatedTimes);
  };

  // Handle saving instructions
  const handleSaveInstructions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `https://backend-zltr.onrender.com/api/cart/${selectedCart._id}/confirm`,
        {
          instructions,
          additionalNotes,
          timesToTake: timesToTake.filter((time) => time !== ""),
          status: "confirmed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the local state with the updated cart
      setCarts(carts.map(cart =>
        cart._id === selectedCart._id ? response.data : cart
      ));

      setSuccess("Prescription saved successfully");
      setShowModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to save prescription");
      }
      console.error("Error saving instructions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedCarts = groupCartsByUser();

  return (
    <div className="all-carts-page-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <h2 className="mb-4" style={{ color: '#02487a' }}>All Carts</h2>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}

          {isLoading && !carts.length ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead style={{ backgroundColor: '#02487a', color: 'white' }} className="custom-table">
                <tr>
                  <th>Patient Information</th>
                  <th>Medication Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedCarts).length > 0 ? (
                  Object.keys(groupedCarts).map((userId) => {
                    const userGroup = groupedCarts[userId];
                    return userGroup.carts.map((cart, index) => (
                      <tr key={cart._id}>
                        {index === 0 && (
                          <td rowSpan={userGroup.carts.length}>
                            <div className="patient-info-card">
                              <div className="patient-name">
                                <strong>{userGroup.user?.firstName} {userGroup.user?.lastName}</strong>
                              </div>
                              <div className="patient-contact">
                                <div className="contact-item">
                                  <i className="bi bi-telephone me-2"></i>
                                  {userGroup.user?.phoneNumber || 'Phone not provided'}
                                </div>
                                <div className="contact-item">
                                  <i className="bi bi-envelope me-2"></i>
                                  {userGroup.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td>
                          <div className="medication-item">
                            {cart.medicationId?.image && (
                              <img
                                src={`https://backend-zltr.onrender.com/uploads/${cart.medicationId.image}`}
                                alt={cart.medicationId?.name}
                                className="medication-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-medication.png";
                                }}
                              />
                            )}
                            <div className="medication-details">
                              <strong>{cart.medicationId?.name}</strong>
                              {cart.medicationId?.description && (
                                <div className="text-muted small">
                                  {cart.medicationId.description.substring(0, 50)}...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{cart.quantity}</td>
                        <td>USh {cart.price?.toLocaleString()}</td>
                        <td>USh {(cart.price * cart.quantity)?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${cart.status === "confirmed" ? "bg-success" : "bg-warning"}`}>
                            {cart.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant={cart.status === "confirmed" ? "outline-primary" : "primary"}
                            size="sm"
                            onClick={() => handleViewDetails(cart)}
                            disabled={isLoading}
                          >
                            {cart.status === "confirmed" ? "View Prescription" : "Add Prescription"}
                            {isLoading && <Spinner animation="border" size="sm" className="ms-2" />}
                          </Button>
                        </td>
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      {isLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        "No carts found"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Container>
      </div>

      {/* Prescription Modal */}
      <Modal show={showModal} onHide={() => !isLoading && setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCart?.status === "confirmed" ? "Prescription Details" : "Create Prescription"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dosage Instructions *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Example: Take 2 tablets once a day after meals"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                disabled={selectedCart?.status === "confirmed"}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Times to Take *</Form.Label>
              {timesToTake.map((time, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                    disabled={selectedCart?.status === "confirmed"}
                  />
                  {timesToTake.length > 1 && !(selectedCart?.status === "confirmed") && (
                    <Button
                      variant="outline-danger"
                      className="ms-2"
                      onClick={() => handleRemoveTime(index)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {selectedCart?.status !== "confirmed" && (
                <Button
                  variant="outline-primary"
                  onClick={handleAddTime}
                  disabled={isLoading}
                >
                  Add Another Time
                </Button>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Example: Avoid alcohol while taking this medication"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                disabled={selectedCart?.status === "confirmed"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Close
          </Button>
          {selectedCart?.status !== "confirmed" && (
            <Button
              variant="primary"
              onClick={handleSaveInstructions}
              disabled={isLoading || !instructions || timesToTake.some(t => !t)}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Prescription"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCartsPage;
