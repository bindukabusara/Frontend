import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, Form } from "react-bootstrap";
import axios from "axios";
import SidebarS from "../Bar/SidebarS";
import NavbarS from "../Bar/NavbarS";
import "./OrdersS.css"; // Custom CSS for styling

const AllCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");
  const [selectedCart, setSelectedCart] = useState(null); // Selected cart for the modal
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [instructions, setInstructions] = useState(""); // Dosage instructions
  const [additionalNotes, setAdditionalNotes] = useState(""); // Additional notes
  const [timesToTake, setTimesToTake] = useState([""]); // Array of times to take the medication

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

  // Handle opening the View Details modal
  const handleViewDetails = (cart) => {
    setSelectedCart(cart);
    setShowModal(true);
  };

  // Handle adding a new time input field
  const handleAddTime = () => {
    setTimesToTake([...timesToTake, ""]); // Add a new empty time field
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
      // Update the cart with instructions, additional notes, and times to take
      const response = await axios.put(
        `https://backend-zltr.onrender.com/api/cart/${selectedCart._id}/confirm`,
        {
          instructions,
          additionalNotes,
          timesToTake: timesToTake.filter((time) => time !== ""), // Save only non-empty times
          status: "confirmed", // Update the status to confirmed
        }
      );

      // Update the local state with the updated cart
      const updatedCarts = carts.map((cart) =>
        cart._id === selectedCart._id ? response.data : cart
      );
      setCarts(updatedCarts);

      // Close the modal and reset the form
      setShowModal(false);
      setInstructions("");
      setAdditionalNotes("");
      setTimesToTake([""]);
    } catch (err) {
      setError("Failed to save instructions");
      console.error("Error saving instructions:", err);
    }
  };

  const groupedCarts = groupCartsByUser();

  return (
    <div className="all-carts-page-container">
      <NavbarS />
      <SidebarS />
      <div className="main-content">
        <Container>
          <h2>All Carts</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover>
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
                      {/* Display user name only in the first row */}
                      {index === 0 ? (
                        <td rowSpan={userGroup.carts.length}>
                          {userGroup.user?.firstName} {userGroup.user?.lastName}
                        </td>
                      ) : null}
                      <td>
                        <img
                          src={`http://backend-zltr.onrender.com/uploads/${cart.medicationId?.image}`}
                          alt={cart.medicationId?.name}
                          className="medication-image"
                        />
                        {cart.medicationId?.name}
                      </td>
                      <td>{cart.quantity}</td>
                      <td>USh {cart.price}</td>
                      <td>USh {cart.price * cart.quantity}</td>
                      <td>{cart.status || "Pending"}</td>
                      <td>
                        <Button variant="primary" onClick={() => handleViewDetails(cart)}>
                        Prescription
                        </Button>
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No carts found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* View Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Medication Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dosage Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Example: Take 2 tablets once a day after meals"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Times to Take</Form.Label>
              {timesToTake.map((time, index) => (
                <div key={index} className="mb-2">
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="secondary" onClick={handleAddTime}>
                Add Another Time
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveInstructions}>
            Save Instructions
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCartsPage;
