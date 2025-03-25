import { useState } from 'react';
import '../bar/sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faCog,
  faLifeRing,
  faCalendarAlt,
  faCartShopping,
  faNoteSticky,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <h2>Main</h2>
        <ul>
          <li>
            <NavLink
              to="/dash"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </NavLink>
          </li>
        </ul>

        <h2>My Cart</h2>
        <ul>
          <li>
            <NavLink
              to="/card"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faCartShopping} /> Cart
            </NavLink>
          </li>
        </ul>

        <h2>Reminder</h2>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Reminder
            </NavLink>
          </li>
        </ul>

        <h2>Reports</h2>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faNoteSticky} /> Reports
            </NavLink>
          </li>
        </ul>

        <h2>Settings</h2>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faCog} /> Settings
            </NavLink>
          </li>
        </ul>

        <h2>Support</h2>
        <ul>
          <li>
            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faLifeRing} /> Support
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
