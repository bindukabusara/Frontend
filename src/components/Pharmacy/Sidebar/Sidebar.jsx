import '../Sidebar/sidebar.css';
import { NavLink } from 'react-router-dom'; // Replace Link with NavLink
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faPills,
  faStore,
  faBox,
  faUsers,
  faChartLine,
  faCog,
  faLifeRing,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <><br></br><br></br><br></br>
      <div className="sidebar">


        <h2>Main</h2>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
            >
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </NavLink>
          </li>
        </ul>

        <h2>Medications</h2>
        <ul>
          <li>
            <NavLink
              to="/expiring-medications"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
            >
              <FontAwesomeIcon icon={faPills} /> Expiring Medications
            </NavLink>
          </li>
        </ul>

        <h2>Store Management</h2>
        <ul>
          <li>
            <NavLink
              to="/medications"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
            >
              <FontAwesomeIcon icon={faStore} /> Store
            </NavLink>
          </li>

        </ul>

        <h2>Orders</h2>
        <ul>
          <li>
            <NavLink
              to="/order"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
            >
              <FontAwesomeIcon icon={faChartLine} /> Reports
            </NavLink>
          </li>
        </ul>

        <h2>Settings</h2>
        <ul>
          <li>
            <NavLink
              to="/setting"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
