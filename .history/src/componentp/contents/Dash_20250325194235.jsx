import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Offcanvas, Form } from "react-bootstrap";
import axios from "axios";
import SidebarP from "../bar/SidebarP";
import NavbarP from "../bar/NavbarP";
import "./Orders.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [medications, setMedications] = useState([]);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Fetch all medications from the backend
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await axios.get("https://backend-zltr.onrender.com/api/medications");
                const currentDate = new Date();

                // Filter out expired medications
                const validMedications = response.data.filter(
                    (medication) => new Date(medication.expireDate) > currentDate
                );

                setMedications(validMedications);
                setFilteredMedications(validMedications);
            } catch (err) {
                console.error("Error fetching medications:", err);
            }
        };

        fetchMedications();
    }, []);

    // Fetch user's cart from the backend
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://backend-zltr.onrender.com/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter medications based on the search query
        const filtered = medications.filter((medication) =>
            medication.name.toLowerCase().includes(query)
        );
        setFilteredMedications(filtered);
    };

    // Add medication to cart
    const addToCart = async (medication) => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const payload = {
                medicationId: medication._id,
                name: medication.name,
                price: medication.price,
                quantity: 1,
                image: medication.image,
                userId: user.id,
            };

            const response = await axios.post(
                "https://backend-zltr.onrender.com/api/cart/add",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                const existingItem = cart.find((item) => item.medicationId === medication._id);
                if (existingItem) {
                    setCart((prevCart) =>
                        prevCart.map((item) =>
                            item.medicationId === medication._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    );
                } else {
                    setCart((prevCart) => [
                        ...prevCart,
                        { ...medication, quantity: 1, medicationId: medication._id },
                    ]);
                }
                setShowCart(true);
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    // Update quantity of an item in the cart
    const updateQuantity = async (id, amount) => {
        try {
            const token = localStorage.getItem("token");
            const itemToUpdate = cart.find((item) => item._id === id);
            if (!itemToUpdate) {
                console.error("Item not found in cart");
                return;
            }

            const newQuantity = itemToUpdate.quantity + amount;

            if (newQuantity > 0) {
                const response = await axios.put(
                    `https://backend-zltr.onrender.com/api/cart/${id}`,
                    { quantity: newQuantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setCart((prevCart) =>
                    prevCart.map((item) =>
                        item._id === id ? { ...item, quantity: newQuantity } : item
                    )
                );
            } else {
                await axios.delete(`https://backend-zltr.onrender.com/api/cart/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart((prevCart) => prevCart.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://backend-zltr.onrender.com/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart((prevCart) => prevCart.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle checkout button click
    const handleCheckout = () => {
        navigate("/card");
    };

    return (
        <div className="order-container">
            <NavbarP />
            <SidebarP />
            <div className="main-content">
                <Container><br></br><br></br>
                    <h2>Order Medications</h2>
                    <div className="user-info">
                        <h4>Hey, {user?.firstName} {user?.lastName}</h4>
                        <p>Phone: {user?.phoneNumber}</p>
                    </div>
                    <Row className="mb-4">
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Search medication by name"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-bar"
                            />
                        </Col>
                    </Row>
                    <Row>
                        {filteredMedications.map((medication) => (
                            <Col md={3} key={medication._id}>
                                <Card className="med-card">
                                    <div className="med-img-container">
                                        <Card.Img
                                            variant="top"
                                            src={`https://backend-zltr.onrender.com/uploads/${medication.image}`}
                                            className="med-img"
                                        />
                                    </div>
                                    <Card.Body>
                                        <Card.Title className="med-name">{medication.name}</Card.Title>
                                        <Card.Text className="med-price">USh {medication.price}</Card.Text>
                                        <Button className="add-btn" onClick={() => addToCart(medication)}>
                                            + Add
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* Shopping Cart Offcanvas */}
            <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <img
                                        src={`https://backend-zltr.onrender.com/uploads/${item.image}`}
                                        alt={item.name}
                                        className="cart-img"
                                    />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>USh {item.price * item.quantity}</p>
                                        <div className="cart-controls">
                                            <Button variant="secondary" onClick={() => updateQuantity(item._id, -1)}>
                                                -
                                            </Button>
                                            <span>{item.quantity}</span>
                                            <Button variant="secondary" onClick={() => updateQuantity(item._id, 1)}>
                                                +
                                            </Button>
                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() => removeFromCart(item._id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="cart-summary">
                                <p>Shipping and taxes are computed at checkout.</p>
                                <p className="total">Total: USh {totalPrice}</p>
                                <Button className="checkout-btn" onClick={handleCheckout}>
                                    Checkout
                                </Button>
                            </div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default OrderPage;
