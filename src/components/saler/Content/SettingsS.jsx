import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from "react-bootstrap";
import SidebarS from "../Bar/SidebarS";
import NavbarS from "../Bar/NavbarS";
import "./Setting.css"; // Custom CSS for the settings page

const SettingsPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile Settings
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  });

  // Pharmacy Settings
  const [pharmacy, setPharmacy] = useState({
    name: "Pharmacy Name",
    address: "123 Pharmacy St, City, Country",
    licenseNumber: "PH123456",
    phone: "123-456-7890",
  });

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSuccess("Profile updated successfully!");
    setError("");
  };

  // Handle pharmacy details update
  const handlePharmacyUpdate = (e) => {
    e.preventDefault();
    setSuccess("Pharmacy details updated successfully!");
    setError("");
  };

  // Handle security settings update
  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    setSuccess("Security settings updated successfully!");
    setError("");
  };

  // Handle notification settings update
  const handleNotificationUpdate = (e) => {
    e.preventDefault();
    setSuccess("Notification settings updated successfully!");
    setError("");
  };

  return (
    <div className="settings-page-container">
      <NavbarS />
      <SidebarS />
      <div className="main-content">
        <Container>
          <br></br><br></br><br></br>
          <h2>Settings</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Tabs defaultActiveKey="profile" id="settings-tabs" className="mb-3">
            {/* Profile Settings Tab */}
            <Tab eventKey="profile" title="Profile">
              <Card className="mt-4">
                <Card.Body>
                  <h4>Profile Settings</h4>
                  <Form onSubmit={handleProfileUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Update Profile
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            {/* Pharmacy Settings Tab */}
            <Tab eventKey="pharmacy" title="Pharmacy">
              <Card className="mt-4">
                <Card.Body>
                  <h4>Pharmacy Details</h4>
                  <Form onSubmit={handlePharmacyUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pharmacy Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={pharmacy.name}
                        onChange={(e) => setPharmacy({ ...pharmacy, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={pharmacy.address}
                        onChange={(e) => setPharmacy({ ...pharmacy, address: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>License Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={pharmacy.licenseNumber}
                        onChange={(e) => setPharmacy({ ...pharmacy, licenseNumber: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={pharmacy.phone}
                        onChange={(e) => setPharmacy({ ...pharmacy, phone: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Update Pharmacy Details
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            {/* Security Settings Tab */}
            <Tab eventKey="security" title="Security">
              <Card className="mt-4">
                <Card.Body>
                  <h4>Security Settings</h4>
                  <Form onSubmit={handleSecurityUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Update Security Settings
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            {/* Notification Settings Tab */}
            <Tab eventKey="notifications" title="Notifications">
              <Card className="mt-4">
                <Card.Body>
                  <h4>Notification Settings</h4>
                  <Form onSubmit={handleNotificationUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Email Notifications"
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailNotifications: e.target.checked })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="SMS Notifications"
                        checked={notifications.smsNotifications}
                        onChange={(e) =>
                          setNotifications({ ...notifications, smsNotifications: e.target.checked })
                        }
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Update Notification Settings
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default SettingsPage;
