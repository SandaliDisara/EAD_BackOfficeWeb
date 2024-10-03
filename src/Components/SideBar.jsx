import React, { useState } from 'react';
import '../Styles/sidebarStyles.css'; // Import your custom CSS file

const Sidebar = ({ setSelectedComponent }) => {
  const [activeItem, setActiveItem] = useState('Products'); // State to track the active item

  // Function to handle the click event and set the active item
  const handleItemClick = (item) => {
    setActiveItem(item);  // Set the active item
    setSelectedComponent(item);  // Notify App.js to render the correct component
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
          <a href="#" className="nav-link">Log Out</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
