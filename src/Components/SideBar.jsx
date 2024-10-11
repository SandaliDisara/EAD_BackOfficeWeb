import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../Styles/sidebarStyles.css'; // Import your custom CSS file

const Sidebar = ({ setSelectedComponent, userRole }) => {
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
        <h4>Normy Tronics</h4>
      </a>
      <ul className="nav nav-pills flex-column mb-auto">
        {/* Product Listing is visible to Administrator and CSR only */}
        {(userRole === 'Administrator' || userRole === 'CSR') && (
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'Products' ? 'active' : ''}`}
              onClick={() => handleItemClick('Products')}
            >
              Product Listing
            </a>
          </li>
        )}

        {/* Administrator and CSR-specific items */}
        {(userRole === 'Administrator' || userRole === 'CSR') && (
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'OrderManagement' ? 'active' : ''}`}
              onClick={() => handleItemClick('OrderManagement')}
            >
              Order Management
            </a>
          </li>
        )}

        {/* Administrator-specific items */}
        {userRole === 'Administrator' && (
          <>
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
                className={`nav-link ${activeItem === 'Vendors' ? 'active' : ''}`}
                onClick={() => handleItemClick('Vendors')}
              >
                Vendors
              </a>
            </li>
          </>
        )}

        {/* Customer Accounts visible to both Administrator and CSR roles */}
        {(userRole === 'Administrator' || userRole === 'CSR') && (
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'CustomerAccounts' ? 'active' : ''}`}
              onClick={() => handleItemClick('CustomerAccounts')}
            >
              Customer Accounts
            </a>
          </li>
        )}

        {/* Vendor-specific items */}
        {userRole === 'Vendor' && (
        <>
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'VendorOrders' ? 'active' : ''}`}
              onClick={() => handleItemClick('VendorOrders')}
            >
              Manage Orders
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'CustomerFeedback' ? 'active' : ''}`}
              onClick={() => handleItemClick('CustomerFeedback')}
            >
              Customer Feedback
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'VendorProducts' ? 'active' : ''}`} // Vendor Products link
              onClick={() => handleItemClick('VendorProducts')}
            >
              Vendor Products
            </a>
          </li>
        </>
        )}

        {/* Notifications link visible to Administrator, CSR, and Vendor */}
        {(userRole === 'Administrator' || userRole === 'Vendor' || userRole === 'CSR') && (
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === 'Notifications' ? 'active' : ''}`}
              onClick={() => handleItemClick('Notifications')}
            >
              Notifications
            </a>
          </li>
        )}

        <hr />
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleLogout}>
            Log Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
