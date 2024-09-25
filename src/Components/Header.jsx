import React from 'react';
import '../Styles/headerStyles.css'; // Import the CSS file

const Header = () => {
  return (
    <div className="header d-flex justify-content-between p-3 shadow-sm">
      <input
        type="text"
        className="form-control w-50"
        placeholder="Search..."
      />
      <div className="d-flex align-items-center">
        <div className="text-right mr-3">
          <p className="mb-0">Luke Asote</p>
          <small>Administator</small>
        </div>
        <img
          src="https://via.placeholder.com/40"
          alt="Admin Avatar"
          className="rounded-circle"
        />
      </div>
    </div>
  );
};

export default Header;
