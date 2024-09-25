import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const BackOfficersTable = () => {
  const [backOfficers, setBackOfficers] = useState([]);

  // Fetch back officers from API on component load
  useEffect(() => {
    const fetchBackOfficers = async () => {
      try {
        const response = await axios.get('http://localhost:5228/api/BackOfficer'); // Update URL based on your API
        setBackOfficers(response.data); // Set the fetched back officers to the state
      } catch (error) {
        console.error('Error fetching back officers:', error);
      }
    };

    fetchBackOfficers();
  }, []);

  // Handle delete back officer (optional)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5228/api/BackOfficer/${id}`); // Update URL based on your API
      setBackOfficers(backOfficers.filter(bo => bo.id !== id)); // Remove deleted officer from UI
    } catch (error) {
      console.error('Error deleting back officer:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Back Officers</h4>
      </div>

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
          {backOfficers.map(backOfficer => (
            <tr key={backOfficer.id}>
              <td>{backOfficer.name}</td>
              <td>{backOfficer.username}</td>
              <td>{backOfficer.role}</td>
              <td>{backOfficer.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button variant="link" className="text-primary">Edit</Button>
                <Button variant="link" className="text-danger" onClick={() => handleDelete(backOfficer.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BackOfficersTable;
