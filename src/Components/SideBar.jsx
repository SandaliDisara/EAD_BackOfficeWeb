import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../Styles/sidebarStyles.css'; // Import your custom CSS file

const Sidebar = ({ setSelectedComponent }) => {
  const [activeItem, setActiveItem] = useState('Products'); // State to track the active item
  const navigate = useNavigate(); // Get the navigate function for redirection

  // Function to handle the click event and set the active item
  const handleItemClick = (item) => {
    setActiveItem(item);  // Set the active item
    setSelectedComponent(item);  // Notify App.js to render the correct component
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('backofficerToken'); // Clear the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="d-flex flex-column vh-100 p-3 sidebar" style={{ width: '250px' }}>
      <a href="/" className="text-decoration-none text-white mb-4">
        <h4>Normy Clothes</h4>
      </a>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'Products' ? 'active' : ''}`}
            onClick={() => handleItemClick('Products')}
          >
            Product Listing
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'OrderManagement' ? 'active' : ''}`}
            onClick={() => handleItemClick('OrderManagement')}
          >
            Order Management
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'Vendors' ? 'active' : ''}`}
            onClick={() => handleItemClick('Vendors')}
          >
            Vendors
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'BackOfficers' ? 'active' : ''}`}
            onClick={() => handleItemClick('BackOfficers')}
          >
            Back Officers
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'Inventory' ? 'active' : ''}`}
            onClick={() => handleItemClick('Inventory')}
          >
            Inventory
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeItem === 'CustomerAccounts' ? 'active' : ''}`}
            onClick={() => handleItemClick('CustomerAccounts')}
          >
            Customer Accounts
          </a>
        </li>
        <hr />
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleLogout}>Log Out</a> {/* Call handleLogout on click */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
