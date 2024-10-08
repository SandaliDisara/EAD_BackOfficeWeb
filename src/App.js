import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import Header from './Components/Header';
import ProductsTable from './Components/ProductsTable';
import BackOfficersTable from './Components/BackOfficersTable';
import VendorsTable from './Components/VendorsTable';
import CustomerAccounts from './Components/CustomerAccounts';
import VendorFeedbackTable from './Components/VendorFeedbackTable';
import AllOrderManagement from './Components/AllOrderManagement';
import VendorOrderManagement from './Components/VendorOrderManagement';
import CustomerFeedbackTable from './Components/CustomerFeedbackTable';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [selectedComponent, setSelectedComponent] = useState('Products');
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const backOfficerData = JSON.parse(localStorage.getItem('backofficerDetails'));
    if (backOfficerData && backOfficerData.role) {
      setUserRole(backOfficerData.role);
      setUsername(backOfficerData.username);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Products':
        return <ProductsTable />;
      case 'BackOfficers':
        return userRole === 'Administrator' ? <BackOfficersTable /> : <ProductsTable />;
      case 'Vendors':
        return userRole === 'Administrator' ? <VendorsTable /> : <ProductsTable />;
      case 'CustomerAccounts':
        return userRole === 'Administrator' || userRole === 'CSR' ? <CustomerAccounts /> : <ProductsTable />;
      case 'VendorFeedback':
        return userRole === 'Vendor' ? <VendorFeedbackTable /> : <ProductsTable />;
      case 'OrderManagement' :
        return userRole === 'Administrator' || userRole === 'CSR' ? <AllOrderManagement /> : <ProductsTable />;
      case 'VendorOrders': 
        return userRole === 'Vendor' ? <VendorOrderManagement /> : <ProductsTable />;
      case 'CustomerFeedback':  
        return userRole === 'Vendor' ? <CustomerFeedbackTable /> : <ProductsTable />;
      default:
        return <ProductsTable />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar setSelectedComponent={setSelectedComponent} userRole={userRole} />
      <div className="w-100">
        <Header username={username} role={userRole} />
        <div className="container-fluid">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default App;
