import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Badge, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarP from "../bar/SidebarP";
import NavbarP from "../bar/NavbarP";
import "./reminder.css";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const navigate = useNavigate();

  // Fetch all reminders and confirmed orders
  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch both reminders and confirmed orders in parallel
      const [remindersResponse, ordersResponse] = await Promise.all([
        axios.get("http://localhost:5009/api/reminders", { headers }).catch(() => ({ data: [] })),
        axios.get("http://localhost:5009/api/orders/confirmed", { headers }).catch(() => ({ data: [] }))
      ]);

      // Transform confirmed orders into reminder format
      const orderReminders = ordersResponse.data.map(order => ({
        _id: order._id,
        patientId: order.userId?._id,
        patientName: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "Unknown Patient",
        medicationId: order.medicationId?._id,
        medicationName: order.medicationId?.name || order.name,
        medicationImage: order.medicationId?.image || order.image,
        instructions: order.instructions,
        additionalNotes: order.additionalNotes,
        timesToTake: order.timesToTake || [],
        status: order.status || "active",
        isFromOrder: true
      }));

      // Combine and deduplicate reminders
      const combinedReminders = [...remindersResponse.data, ...orderReminders];
      const uniqueReminders = combinedReminders.filter(
        (reminder, index, self) => index === self.findIndex(r => r._id === reminder._id)
      );

      setReminders(uniqueReminders);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch reminders");
    } finally {
      setIsLoading(false);
    }
  };

  // Play alert sound
  const playAlertSound = () => {
    try {
      const audio = new Audio("/alarm.mp3");
      audio.loop = true; // Make the alarm repeat until dismissed
      audio.play().catch(e => console.log("Audio play failed:", e));
      return audio; // Return audio object so we can stop it later
    } catch (e) {
      console.log("Audio error:", e);
      return null;
    }
  };

  // Stop alert sound
  const stopAlertSound = (audio) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // Show browser notification
  const showNotification = (reminder) => {
    if (!("Notification" in window)) return;

    const notificationOptions = {
      body: `Instructions: ${reminder.instructions}\n${reminder.additionalNotes ? `Notes: ${reminder.additionalNotes}` : ''}`,
      icon: "/medication-icon.png",
      requireInteraction: true // Keep notification visible until dismissed
    };

    if (Notification.permission === "granted") {
      new Notification(`Time to take ${reminder.medicationName}`, notificationOptions);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(`Time to take ${reminder.medicationName}`, notificationOptions);
        }
      });
    }
  };

  // Check for due reminders
  const checkDueReminders = () => {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    const dueItems = reminders.filter(reminder => {
      // Check if any of the reminder times matches current time
      const isDue = reminder.timesToTake?.some(time => {
        // Normalize time format (handle both "8:00" and "08:00")
        const [hours, minutes] = time.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        return formattedTime === currentTime;
      });

      return isDue &&
             reminder.status === "active" &&
             !activeAlerts.some(alert => alert._id === reminder._id);
    });

    if (dueItems.length > 0) {
      const audio = playAlertSound();
      const alertsWithAudio = dueItems.map(item => ({ ...item, audio }));

      setActiveAlerts(prev => [...prev, ...alertsWithAudio]);
      dueItems.forEach(showNotification);
    }
  };

  // Mark reminder as completed
  const handleCompleteReminder = async (reminderId, isFromOrder = false) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      let response;

      if (isFromOrder) {
        response = await axios.post(
          `http://localhost:5009/api/orders/provide-instructions`,
          { orderId: reminderId, status: "completed" },
          { headers }
        );
      } else {
        response = await axios.post(
          `http://localhost:5009/api/reminders/${reminderId}/complete`,
          {},
          { headers }
        );
      }

      // Stop the alarm if it's playing
      const completedAlert = activeAlerts.find(a => a._id === reminderId);
      if (completedAlert?.audio) {
        stopAlertSound(completedAlert.audio);
      }

      // Update local state
      setReminders(prev => prev.map(r =>
        r._id === reminderId ? { ...r, status: "completed", completedAt: new Date() } : r
      ));

      setActiveAlerts(prev => prev.filter(a => a._id !== reminderId));
      setSuccess("Reminder marked as completed");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete reminder");
      console.error("Completion error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close an active alert
  const handleCloseAlert = (reminderId) => {
    const dismissedAlert = activeAlerts.find(a => a._id === reminderId);
    if (dismissedAlert?.audio) {
      stopAlertSound(dismissedAlert.audio);
    }
    setActiveAlerts(prev => prev.filter(a => a._id !== reminderId));
  };

  useEffect(() => {
    fetchReminders();

    // Check immediately when component mounts
    checkDueReminders();

    // Set up interval to check every 30 seconds (more responsive)
    const interval = setInterval(checkDueReminders, 30000);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().catch(console.error);
    }

    return () => {
      clearInterval(interval);
      // Clean up any playing audio when component unmounts
      activeAlerts.forEach(alert => {
        if (alert.audio) {
          stopAlertSound(alert.audio);
        }
      });
    };
  }, [reminders]); // Add reminders to dependency array

  return (
    <div className="reminder-page-container">
      <NavbarP />
      <SidebarP />
      <div className="main-content">
        <Container>
          <h2 className="mb-4" style={{ color: '#02487a' }}>Medication Reminders</h2>

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

          {/* Active Alerts Section */}
          {activeAlerts.length > 0 && (
            <div className="alerts-section mb-4">
              <h4 className="text-danger">
                <i className="bi bi-bell-fill me-2"></i>
                Active Medication Alerts
              </h4>
              {activeAlerts.map(alert => (
                <Alert
                  key={alert._id}
                  variant="danger"
                  onClose={() => handleCloseAlert(alert._id)}
                  dismissible
                  className="d-flex align-items-center"
                >
                  <div className="me-3">
                    <i className="bi bi-alarm fs-3"></i>
                  </div>
                  <div>
                    <h5>Time to take {alert.medicationName}!</h5>
                    <p className="mb-1"><strong>Instructions:</strong> {alert.instructions}</p>
                    {alert.additionalNotes && (
                      <p className="mb-1"><strong>Notes:</strong> {alert.additionalNotes}</p>
                    )}
                    <p className="mb-2"><strong>Scheduled Time(s):</strong> {alert.timesToTake?.join(", ")}</p>
                    <Button
                      variant="success"
                      size="sm"
                      className="mt-1"
                      onClick={() => handleCompleteReminder(alert._id, alert.isFromOrder)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Mark as Taken
                        </>
                      )}
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {isLoading && !reminders.length ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p>Loading reminders...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead style={{ backgroundColor: '#02487a', color: 'white' }}>
                <tr>
                  <th>Medication</th>
                  <th>Instructions</th>
                  <th>Times</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.length > 0 ? (
                  reminders.map(reminder => (
                    <tr key={reminder._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <img
                              src={`http://localhost:5009/uploads/${reminder.medicationImage || 'default-medication.png'}`}
                              alt={reminder.medicationName}
                              className="medication-thumbnail"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-medication.png";
                              }}
                            />
                          </div>
                          <div>
                            <strong>{reminder.medicationName}</strong>
                            {reminder.patientName && (
                              <div className="text-muted small">
                                For: {reminder.patientName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{reminder.instructions}</td>
                      <td>
                        {reminder.timesToTake?.map((time, i) => (
                          <Badge key={i} bg="info" className="me-1 mb-1">
                            {time}
                          </Badge>
                        ))}
                      </td>
                      <td>
                        <Badge bg={reminder.status === "active" ? "success" : "secondary"}>
                          {reminder.status === "active" ? "Active" : "Completed"}
                        </Badge>
                        {reminder.status === "completed" && reminder.completedAt && (
                          <div className="small text-muted mt-1">
                            {new Date(reminder.completedAt).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setSelectedReminder(reminder);
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-eye-fill me-1"></i>
                          Details
                        </Button>
                        {reminder.status === "active" && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleCompleteReminder(reminder._id, reminder.isFromOrder)}
                            disabled={isLoading}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      {isLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        "No reminders found"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Container>
      </div>

      {/* Reminder Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#02487a', color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-prescription me-2"></i>
            {selectedReminder?.medicationName || "Reminder Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReminder && (
            <div className="reminder-details">
              <div className="d-flex mb-4">
                <div className="me-4">
                  <img
                    src={`http://localhost:5009/uploads/${selectedReminder.medicationImage || 'default-medication.png'}`}
                    alt={selectedReminder.medicationName}
                    className="medication-image-large"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-medication.png";
                    }}
                  />
                </div>
                <div>
                  <h4>{selectedReminder.medicationName}</h4>
                  <p className="text-muted">
                    <i className="bi bi-person-fill me-2"></i>
                    For: {selectedReminder.patientName || "Unknown Patient"}
                  </p>

                  <div className="mb-3">
                    <h5><i className="bi bi-list-check me-2"></i>Instructions</h5>
                    <p className="ps-4">{selectedReminder.instructions}</p>
                  </div>

                  <div className="mb-3">
                    <h5><i className="bi bi-clock-history me-2"></i>Schedule</h5>
                    <div className="ps-4">
                      {selectedReminder.timesToTake?.map((time, i) => (
                        <Badge key={i} bg="info" className="me-2 mb-2">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedReminder.additionalNotes && (
                    <div className="mb-3">
                      <h5><i className="bi bi-card-text me-2"></i>Notes</h5>
                      <p className="ps-4">{selectedReminder.additionalNotes}</p>
                    </div>
                  )}

                  <div className="status-info mt-4">
                    <h5><i className="bi bi-info-circle me-2"></i>Status</h5>
                    <div className="ps-4">
                      <Badge bg={selectedReminder.status === "active" ? "success" : "secondary"}>
                        {selectedReminder.status === "active" ? "Active" : "Completed"}
                      </Badge>
                      {selectedReminder.status === "completed" && selectedReminder.completedAt && (
                        <p className="mt-2">
                          <i className="bi bi-calendar-check me-2"></i>
                          Completed at: {new Date(selectedReminder.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
          {selectedReminder?.status === "active" && (
            <Button
              variant="primary"
              onClick={() => {
                handleCompleteReminder(selectedReminder._id, selectedReminder.isFromOrder);
                setShowModal(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Completing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Mark as Completed
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReminderPage;
