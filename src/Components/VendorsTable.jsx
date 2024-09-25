import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap'; // Using Bootstrap components
import axios from 'axios';

const VendorsTable = () => {
  const [vendors, setVendors] = useState([]);

  // Fetch vendors from API on component load
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5228/api/Vendor'); // Adjust API endpoint if needed
        const vendorList = response.data; // Assuming the data contains vendors
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Vendors</h4>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Average Ranking</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id}>
              <td>{vendor.name}</td>
              <td>{vendor.description}</td>
              <td>{vendor.averageRanking ? vendor.averageRanking.toFixed(2) : 'N/A'}</td> {/* Showing average ranking */}
              <td>
                <Button variant="link" className="text-primary">Edit</Button>
                <Button variant="link" className="text-danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VendorsTable;
