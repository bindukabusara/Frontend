import { useState, useEffect } from 'react';
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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarVisible && !event.target.closest('.sidebar')) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarVisible]);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
      </button>

      <div
        className={`sidebar-overlay ${isSidebarVisible ? 'visible' : ''}`}
        onClick={toggleSidebar}
      />

      <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <h2>Main</h2>
        <ul>
          <li>
            <NavLink
              to="/dash"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsSidebarVisible(false)}
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
              onClick={() => setIsSidebarVisible(false)}
            >
              <FontAwesomeIcon icon={faCartShopping} /> Cart
            </NavLink>
          </li>
        </ul>

        <h2>Reminder</h2>
        <ul>
          <li>
            <NavLink
              to="/reminder"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsSidebarVisible(false)}
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
              onClick={() => setIsSidebarVisible(false)}
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
              onClick={() => setIsSidebarVisible(false)}
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
              onClick={() => setIsSidebarVisible(false)}
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
