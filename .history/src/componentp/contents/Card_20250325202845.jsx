import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import SidebarP from "../bar/SidebarP";
import NavbarP from "../bar/NavbarP";
import "./Orders.css";
import ".";
import { FaTrash } from "react-icons/fa";

const MyCartPage = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const user = JSON.parse(localStorage.getItem("user")); // Get user info from localStorage

    // Fetch cart items from the backend
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://backend-zltr.onrender.com/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart(response.data);
                calculateTotalPrice(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    // Calculate total price
    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
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
                await axios.put(
                    `https://backend-zltr.onrender.com/api/cart/${id}`,
                    { quantity: newQuantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updatedCart = cart.map((item) =>
                    item._id === id ? { ...item, quantity: newQuantity } : item
                );
                setCart(updatedCart);
                calculateTotalPrice(updatedCart);
            } else {
                console.log("Quantity cannot be less than 1");
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
            const updatedCart = cart.filter((item) => item._id !== id);
            setCart(updatedCart);
            calculateTotalPrice(updatedCart);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    return (
        <div className="order-container">
            <NavbarP />
            <SidebarP />
            <div className="main-content">
                <Container><br></br><br></br>
                    <h2>My Cart</h2>
                    {/* Display user info */}
                    <div className="user-info">
                        <h4>{user?.firstName} {user?.lastName}</h4>
                        <p>Phone: {user?.phoneNumber}</p>
                    </div>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            <Row>
                                {cart.map((item) => (
                                    <Col md={12} key={item._id} className="mb-3">
                                        <Card className="cart-item-card">
                                            <Row>
                                                <Col md={2}>
                                                    <img
                                                        src={`https://backend-zltr.onrender.com/uploads/${item.image}`}
                                                        alt={item.name}
                                                        className="cart-img"
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <Card.Body>
                                                        <Card.Title className="cart-item-name">
                                                            {item.name}
                                                        </Card.Title>
                                                        <Card.Text className="cart-item-price">
                                                            USh {item.price}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="cart-controls">
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => updateQuantity(item._id, -1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="cart-item-quantity">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => updateQuantity(item._id, 1)}
                                                        >
                                                            +
                                                        </Button>
                                                        <FaTrash
                                                            className="delete-icon"
                                                            onClick={() => removeFromCart(item._id)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <div className="cart-summary">
                                <p>Shipping and taxes are computed at checkout.</p>
                                <p className="total">Total: USh {totalPrice}</p>
                                <Button className="checkout-btn" onClick={() => alert("Proceeding to checkout...")}>
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default MyCartPage;
