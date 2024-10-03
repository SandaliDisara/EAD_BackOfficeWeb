import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Replacing useHistory with useNavigate
import Sidebar from './Components/SideBar';
import Header from './Components/Header';
import ProductsTable from './Components/ProductsTable';
import BackOfficersTable from './Components/BackOfficersTable';
import VendorsTable from './Components/VendorsTable';
import CustomerAccounts from './Components/CustomerAccounts';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('Products');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('backofficerToken');
    
    if (!token) {
      // If no token found, redirect to login page
      navigate('/login'); // Replace history.push with navigate
    }
  }, [navigate]);

  // Function to render the selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Products':
        return <ProductsTable />;
      case 'BackOfficers':
        return <BackOfficersTable />;
      case 'Vendors':
        return <VendorsTable />;
      case 'CustomerAccounts':
        return <CustomerAccounts />;
      default:
        return <ProductsTable />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <div className="w-100">
        <Header />
        <div className="container-fluid">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;
