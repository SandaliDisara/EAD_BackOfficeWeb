import React from 'react';
import '../Styles/headerStyles.css'; // Import the CSS file

const Header = ({ username, role }) => {
  return (
    <div className="header d-flex justify-content-between p-3 shadow-sm">
      <input
        type="text"
        className="form-control w-50"
        placeholder="Search..."
      />
      <div className="d-flex align-items-center">
        <div className="text-right mr-3">
          {/* Display username and role or fallback values */}
          <p className="mb-0">{username || 'Guest'}</p>
          <small>{role || 'Unknown Role'}</small>
        </div>
      </div>
    </div>
  );
};

export default Header;
