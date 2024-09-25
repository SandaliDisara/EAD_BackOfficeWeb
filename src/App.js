import React, { useState } from 'react';
import Sidebar from './Components/SideBar';
import Header from './Components/Header';
import ProductsTable from './Components/ProductsTable';
import BackOfficersTable from './Components/BackOfficersTable';  // Correct import path
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles

function App() {
  const [selectedComponent, setSelectedComponent] = useState('Products'); // State to manage selected component

  // Function to render the selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Products':
        return <ProductsTable />;
      case 'BackOfficers':
        return <BackOfficersTable />;
      default:
        return <ProductsTable />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar setSelectedComponent={setSelectedComponent} /> {/* Pass state setter as prop */}
      <div className="w-100">
        <Header />
        <div className="container-fluid">
          {renderComponent()} {/* Dynamically render the selected component */}
        </div>
      </div>
    </div>
  );
}

export default App;
