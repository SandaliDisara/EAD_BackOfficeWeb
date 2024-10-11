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
      const response = await axios.get(`${baseUrl}api/Customer`); // Fetch all customers
      setCustomers(response.data); // Set the fetched customers to the state
      setFilteredCustomers(response.data); // Initially set filtered customers to all customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Fetch customers who have requested deactivation
  const fetchDeactivateRequests = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/Customer/deactivation-requests`);
      setFilteredCustomers(response.data); // Set the filtered customers to deactivation requests
    } catch (error) {
      console.error('Error fetching deactivation requests:', error);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredCustomers(customers); // Show all if 'All' is selected
    } else if (status === 'Active') {
      setFilteredCustomers(customers.filter(cust => cust.isActive)); // Filter by active users
    } else if (status === 'Inactive') {
      setFilteredCustomers(customers.filter(cust => !cust.isActive)); // Filter by inactive users
    } else if (status === 'DeactivateRequests') {
      fetchDeactivateRequests(); // Fetch customers with deactivate requests
    }
  };

  // Handle user activation
  const handleActivate = async (id) => {
    try {
      await axios.put(`${baseUrl}api/Customer/activate/${id}`);
      fetchCustomers(); // Refresh customer list after activation
      alert('User activated successfully!');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user.');
    }
  };

  // Handle user deactivation
  const handleDeactivate = async (id) => {
    try {
      // Find the customer to deactivate
      const customerToDeactivate = customers.find(customer => customer.id === id);

      if (!customerToDeactivate) {
        alert('Customer not found!');
        return;
      }

      // Call the API to set isActive to false and requestDeactivate to false
      await axios.put(`${baseUrl}api/Customer/${id}`, {
        firstName: customerToDeactivate.firstName,
        lastName: customerToDeactivate.lastName,
        address: customerToDeactivate.address,
        phoneNumber: customerToDeactivate.phoneNumber,
        requestDeactivate: false, // Reset the deactivation request
        isActive: false,  // Deactivate the account
      });

      // After deactivation, refresh the deactivation requests list
      fetchDeactivateRequests();
      alert('User deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Customer Accounts</h4>
      </div>

      {/* Toggle Buttons for filtering active/inactive/deactivate requests users */}
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
        <ToggleButton id="tbg-radio-4" value="DeactivateRequests" variant="outline-primary">
          Deactivate Requests
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
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.firstName}</td>
                <td>{customer.email}</td>
                <td>{customer.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  {selectedStatus === 'DeactivateRequests' ? (
                    <Button
                      variant="danger"
                      onClick={() => handleDeactivate(customer.id)}
                    >
                      Deactivate Account
                    </Button>
                  ) : customer.isActive ? (
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
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No customers available for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerAccounts;
