import React, { useState, useEffect } from 'react';
import { Table, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'; // Using Bootstrap components
import axios from 'axios';
import AddBackOfficerForm from './AddBackOfficerForm'; // Import the form component
import '../Styles/tablesRender.css'

const BackOfficersTable = () => {
  const [backOfficers, setBackOfficers] = useState([]);
  const [filteredBackOfficers, setFilteredBackOfficers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All'); // State to filter by role
  const [showAddForm, setShowAddForm] = useState(false); // State to show/hide form

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch back officers from API on component load
  useEffect(() => {
    fetchBackOfficers();
  }, []);

  const fetchBackOfficers = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/BackOfficer`); // Update URL based on your API
      setBackOfficers(response.data); // Set the fetched back officers to the state
      setFilteredBackOfficers(response.data); // Initially set filtered back officers to all officers
    } catch (error) {
      console.error('Error fetching back officers:', error);
    }
  };

  // Handle delete back officer and vendor
  const handleDelete = async (id, role) => {
    try {
      // If the role is "Vendor", delete the vendor from the Vendor collection first
      if (role === 'Vendor') {
        await axios.delete(`${baseUrl}api/Vendor/${id}`); // Update with the correct Vendor API endpoint
      }

      // Delete the back officer from the BackOfficer collection
      await axios.delete(`${baseUrl}api/BackOfficer/${id}`); // Update URL based on your API
      setBackOfficers(backOfficers.filter(bo => bo.id !== id)); // Remove deleted officer from UI
      setFilteredBackOfficers(filteredBackOfficers.filter(bo => bo.id !== id)); // Remove from filtered list too

      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting back officer or vendor:', error);
      alert('Failed to delete back officer or vendor.');
    }
  };

  // Toggle form visibility
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  // Handle role filter change
  const handleRoleFilterChange = (role) => {
    setSelectedRole(role);
    if (role === 'All') {
      setFilteredBackOfficers(backOfficers); // Show all if 'All' is selected
    } else {
      setFilteredBackOfficers(backOfficers.filter(bo => bo.role === role)); // Filter by selected role
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      {showAddForm ? (
        <AddBackOfficerForm onBackOfficerAdded={() => { setShowAddForm(false); fetchBackOfficers(); }} />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Back Officers</h4>
            <Button className="purple-button" onClick={toggleAddForm}>
              Add New Back Officer
            </Button>
          </div>

          {/* Toggle Buttons for filtering roles */}
          <ToggleButtonGroup
            type="radio"
            name="roles"
            value={selectedRole}
            onChange={handleRoleFilterChange}
            className="mb-3"
          >
            <ToggleButton id="tbg-radio-1" value="All" variant="outline-primary">
              All
            </ToggleButton>
            <ToggleButton id="tbg-radio-2" value="Administrator" variant="outline-primary">
              Administrator
            </ToggleButton>
            <ToggleButton id="tbg-radio-3" value="CSR" variant="outline-primary">
              CSR
            </ToggleButton>
            <ToggleButton id="tbg-radio-4" value="Vendor" variant="outline-primary">
              Vendor
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Back Officers Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredBackOfficers.map(backOfficer => (
                <tr key={backOfficer.id}>
                  <td>{backOfficer.name}</td>
                  <td>{backOfficer.username}</td>
                  <td>{backOfficer.role}</td>
                  <td>{backOfficer.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Button variant="link" className="text-primary">Edit</Button>
                    <Button variant="link" className="text-danger" onClick={() => handleDelete(backOfficer.id, backOfficer.role)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default BackOfficersTable;
