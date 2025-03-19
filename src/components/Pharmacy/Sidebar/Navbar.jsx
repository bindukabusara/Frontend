import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Logout icon
import './Navbar.css'; // Import the CSS file
import logo from './Logo.png'; // Import the logo image

function Navbar() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    // Perform logout logic here
    console.log('User logged out');

    // Clear user session or authentication state
    localStorage.removeItem('authToken'); // Example: Remove token from localStorage
    // You can also clear other user-related data if needed

    // Redirect to the login page or home page
    navigate('/login'); // Replace '/login' with the desired route

    // Close the popup
    setShowLogoutPopup(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          {/* Logo on the left */}
          <div className="navbar-logo">
            <img src={logo} alt="Logo" /> {/* Use the imported logo */}
          </div>

          {/* Logout option with icon and text */}
          <div className="navbar-actions">
            <div className="logout-option" onClick={handleLogoutClick}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <strong>Logout</strong>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Are you sure you want to log out?</h3>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={handleConfirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-button" onClick={handleCancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
