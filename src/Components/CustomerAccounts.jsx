import React, { useState, useEffect } from 'react';
import { Table, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'; // Using Bootstrap components
import axios from 'axios';

const CustomerAccounts = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All'); // State to filter by status

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch customers from API on component load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/Customer`); // Update URL based on your API
      setCustomers(response.data); // Set the fetched customers to the state
      setFilteredCustomers(response.data); // Initially set filtered customers to all customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Handle role filter change
  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredCustomers(customers); // Show all if 'All' is selected
    } else if (status === 'Active') {
      setFilteredCustomers(customers.filter(cust => cust.isActive)); // Filter by active users
    } else if (status === 'Inactive') {
      setFilteredCustomers(customers.filter(cust => !cust.isActive)); // Filter by inactive users
    }
  };

  // Handle user activation
  const handleActivate = async (id) => {
    try {
      // Update customer status to active
      await axios.put(`${baseUrl}api/Customer/activate/${id}`); // Update API call
      fetchCustomers(); // Refresh customer list after activation
      alert('User activated successfully!');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Customer Accounts</h4>
      </div>

      {/* Toggle Buttons for filtering active/inactive users */}
      <ToggleButtonGroup
        type="radio"
        name="status"
        value={selectedStatus}
        onChange={handleStatusFilterChange}
        className="mb-3"
      >
        <ToggleButton id="tbg-radio-1" value="All" variant="outline-primary">
          All
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value="Active" variant="outline-primary">
          Active Users
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value="Inactive" variant="outline-primary">
          Inactive Users
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Customer Accounts Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.firstName}</td>
              <td>{customer.email}</td>
              <td>{customer.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                {customer.isActive ? (
                  <Button variant="link" className="text-muted" disabled>
                    Activate
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => handleActivate(customer.id)}
                  >
                    Activate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerAccounts;
