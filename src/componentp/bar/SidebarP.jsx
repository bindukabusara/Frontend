import '../bar/sidebar.css';
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
  faCalendarAlt,
  faCartShopping,
  faNoteSticky,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <><br></br><br></br><br></br>
      <div className="sidebar">
        <h2>Main</h2>
        <ul>
          <li>
            <NavLink
              to="/dash"
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
              className={({ isActive }) => (isActive ? 'active' : '')} // Apply active class
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
