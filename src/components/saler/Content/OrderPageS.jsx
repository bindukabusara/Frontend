import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
//import Sidebar from "../Pharmacy/Sidebar/sidebar";
//import Navbar from "../Pharmacy/Sidebar/Navbar";
//import "./OrdersPage.css"; // Custom CSS for styling

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://backend-zltr.onrender.com/api/cart/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Handle providing instructions
  const handleProvideInstructions = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Handle saving instructions and updating medication quantity
  const handleSaveInstructions = async () => {
    try {
      // Save instructions (you can send this to the backend if needed)
      console.log("Instructions:", instructions);

      // Update medication quantity
      await axios.put(`https://backend-zltr.onrender.com/api/medications/${selectedOrder.medicationId}/update-quantity`, {
        quantity: selectedOrder.quantity,
      });

      // Close the modal and reset state
      setShowModal(false);
      setInstructions("");
      setSelectedOrder(null);

      // Refresh orders
      const response = await axios.get("https://backend-zltr.onrender.com/api/cart/orders");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to save instructions or update quantity");
      console.error("Error:", err);
    }
  };

  return (
    <div className="orders-page-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Container>
          <h2>Patient Orders</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Medication</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.userId?.firstName} {order.userId?.lastName}</td>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleProvideInstructions(order)}>
                      Provide Instructions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Modal for providing instructions */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Provide Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions for the patient"
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

export default OrdersPage;
