import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from '../Pharmacy/Sidebar/Sidebar';
import Navbar from "../Pharmacy/Sidebar/Navbar";
import "./order.css";

const AllCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCart, setSelectedCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [timesToTake, setTimesToTake] = useState([""]);

  // Fetch all carts
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get("https://backend-zltr.onrender.com/api/cart/all");
        setCarts(response.data);
      } catch (err) {
        setError("Failed to fetch carts");
        console.error("Error fetching carts:", err);
      }
    };

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

  const handleViewDetails = (cart) => {
    setSelectedCart(cart);
    setShowModal(true);
    // Pre-fill existing instructions if available
    if (cart.instructions) setInstructions(cart.instructions);
    if (cart.additionalNotes) setAdditionalNotes(cart.additionalNotes);
    if (cart.timesToTake?.length > 0) setTimesToTake(cart.timesToTake);
    else setTimesToTake([""]);
  };

  const handleAddTime = () => {
    setTimesToTake([...timesToTake, ""]);
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...timesToTake];
    updatedTimes[index] = value;
    setTimesToTake(updatedTimes);
  };

  const handleSaveInstructions = async () => {
    try {
      const response = await axios.put(
        `https://backend-zltr.onrender.com/api/cart/${selectedCart._id}/confirm`,
        {
          instructions,
          additionalNotes,
          timesToTake: timesToTake.filter((time) => time !== ""),
          status: "confirmed",
        }
      );

      // Show success message with timeout
      setSuccess('Instructions saved successfully! Reminders have been set.');
      setTimeout(() => setSuccess(""), 3000);

      // Update local state
      const updatedCarts = carts.map((cart) =>
        cart._id === selectedCart._id ? response.data.cart : cart
      );
      setCarts(updatedCarts);

      // Reset form and close modal
      setShowModal(false);
      setInstructions("");
      setAdditionalNotes("");
      setTimesToTake([""]);
    } catch (err) {
      setError("Failed to save instructions: " + (err.response?.data?.message || err.message));
      console.error("Error saving instructions:", err);
    }
  };

  const groupedCarts = groupCartsByUser();

  return (
    <div className="all-carts-page-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <h2>All Carts</h2>
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>Medication</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
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
                          {userGroup.user?.firstName} {userGroup.user?.lastName}
                          <div className="text-muted small">{userGroup.user?.email}</div>
                        </td>
                      )}
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`https://backend-zltr.onrender.com/uploads/${cart.medicationId?.image}`}
                            alt={cart.medicationId?.name}
                            className="medication-image me-2"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong>{cart.medicationId?.name}</strong>
                            {cart.medicationId?.dosage && (
                              <div className="text-muted small">Dosage: {cart.medicationId.dosage}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{cart.quantity}</td>
                      <td>USh {cart.price?.toLocaleString()}</td>
                      <td>USh {(cart.price * cart.quantity)?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          cart.status === 'confirmed' ? 'bg-success' :
                          cart.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}>
                          {cart.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewDetails(cart)}
                        >
                          {cart.status === 'confirmed' ? 'View Prescription' : 'Add Prescription'}
                        </Button>
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">No carts found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Prescription Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCart?.medicationId?.name} Prescription
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
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Times to Take *</Form.Label>
              {timesToTake.map((time, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required={index === 0}
                    className="me-2"
                  />
                  {timesToTake.length > 1 && (
                    <Button
                      variant="outline-danger"
                      onClick={() => setTimesToTake(timesToTake.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={handleAddTime}
                className="mt-2"
              >
                + Add Another Time
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Example: Avoid alcohol while taking this medication"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveInstructions}
            disabled={!instructions || timesToTake.filter(t => t).length === 0}
          >
            Confirm Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCartsPage;
