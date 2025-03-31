import { useState } from 'react';
import '../Sidebar/sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faPills,
  faStore,
  faBox,
  faChartLine,
  faLifeRing,
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
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </NavLink>
          </li>
        </ul>
        <h2>Store Management</h2>
        <ul>
          <li>
            <NavLink
              to="/medications"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faStore} /> Store
            </NavLink>
          </li>
        </ul>
        <h2>Medications</h2>
        <ul>
          <li>
            <NavLink
              to="/expiring-medications"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faPills} /> Expiring Medications
            </NavLink>
          </li>
        </ul>



        <h2>Orders</h2>
        <ul>
          <li>
            <NavLink
              to="/order"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faBox} /> Orders
            </NavLink>
          </li>
        </ul>

        <h2>Reports</h2>
        <ul>
          <li>
            <NavLink
              to="/reportP"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faChartLine} /> Reports
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
