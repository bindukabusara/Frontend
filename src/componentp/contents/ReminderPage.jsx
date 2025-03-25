import { useState, useEffect } from "react";
import { Container, Card, ListGroup, Badge, Alert, Button } from "react-bootstrap";
import axios from "axios";
import SidebarP from "../bar/SidebarP";
import NavbarP from "../bar/NavbarP";
import "./Reminder.css"; // Custom CSS for styling
import { FaBell, FaCheck } from "react-icons/fa";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user's reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://backend-zltr.onrender.com/api/reminders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders(response.data);
      } catch (err) {
        setError("Failed to fetch reminders");
        console.error("Error fetching reminders:", err);
      }
    };

    fetchReminders();
  }, []);

  // Mark reminder as completed
  const markAsCompleted = async (reminderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://backend-zltr.onrender.com/api/reminders/${reminderId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReminders(reminders.map(r =>
        r._id === reminderId ? { ...r, status: "completed" } : r
      ));
      setSuccess("Medication marked as taken!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update reminder");
      console.error("Error updating reminder:", err);
    }
  };

  // Format time to 12-hour format
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="reminder-container">
      <NavbarP />
      <SidebarP />
      <div className="main-content">
        <Container><br></br><br></br>
          <h2 className="mb-4">My Medication Reminders</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {reminders.length === 0 ? (
            <Card>
              <Card.Body className="text-center">
                <FaBell size={40} className="text-muted mb-3" />
                <h5>No active reminders</h5>
                <p>Your medication reminders will appear here</p>
              </Card.Body>
            </Card>
          ) : (
            <div className="reminder-list">
              {reminders.map((reminder) => (
                <Card key={reminder._id} className="mb-3 reminder-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{reminder.medicationId?.name}</strong>
                      <Badge
                        bg={reminder.status === 'completed' ? 'success' : 'warning'}
                        className="ms-2"
                      >
                        {reminder.status}
                      </Badge>
                    </div>
                    {reminder.status !== 'completed' && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => markAsCompleted(reminder._id)}
                      >
                        <FaCheck className="me-1" /> Mark as Taken
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <h6>Dosage Instructions:</h6>
                      <p>{reminder.dosageInstructions}</p>
                    </div>

                    <div className="mb-3">
                      <h6>Times to Take:</h6>
                      <ListGroup>
                        {reminder.timesToTake.map((time, index) => (
                          <ListGroup.Item key={index}>
                            <FaBell className="me-2 text-primary" />
                            {formatTime(time)}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>

                    {reminder.additionalNotes && (
                      <div>
                        <h6>Additional Notes:</h6>
                        <p>{reminder.additionalNotes}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ReminderPage;
