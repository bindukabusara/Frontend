import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/register"); // Redirect to login if not authenticated
        } else {
            setUser(JSON.parse(storedUser));
        }

        // Mocked orders for demonstration
        setOrders([
            { id: 1, product: "Paracetamol", status: "Pending" },
            { id: 2, product: "Ibuprofen", status: "Delivered" },
            { id: 3, product: "Cough Syrup", status: "Processing" },
        ]);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/register");
    };

    return (
        <Container className="text-center mt-5">
            <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
            <p className="text-muted mb-4">This is your dashboard where you can manage your pharmacy orders and account.</p>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>My Orders</Card.Title>
                            <ListGroup variant="flush">
                                {orders.map((order) => (
                                    <ListGroup.Item key={order.id}>
                                        <Row>
                                            <Col>
                                                <strong>{order.product}</strong>
                                            </Col>
                                            <Col>
                                                <Badge bg={order.status === "Delivered" ? "success" : order.status === "Pending" ? "warning" : "info"}>
                                                    {order.status}
                                                </Badge>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Account Information</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Email:</strong> {user ? user.email : "N/A"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Phone:</strong> {user ? user.phone : "N/A"}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Quick Actions</Card.Title>
                            <Button variant="primary" className="w-100 mb-2" onClick={() => navigate("/shop")}>Shop Medicines</Button>
                            <Button variant="secondary" className="w-100 mb-2" onClick={() => navigate("/orders")}>View Orders</Button>
                            <Button variant="danger" className="w-100" onClick={handleLogout}>Logout</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="text-white bg-dark">
                        <Card.Body>
                            <Card.Title>Pharmacy Announcements</Card.Title>
                            <p>Get the latest updates on new medicines, offers, and more!</p>
                            <Button variant="light" onClick={() => navigate("/offers")}>View Offers</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
