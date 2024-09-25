import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Using Bootstrap components
import axios from 'axios';
import '../Styles/tablesRender.css';

const AddBackOfficerForm = ({ onBackOfficerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: '',
    description: '' // Adding description field for Vendor role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the back officer to the BackOfficer collection
      await axios.post('http://localhost:5228/api/BackOfficer', {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      // If the role is Vendor, add the record to the Vendor collection with description
      if (formData.role === 'Vendor') {
        await axios.post('http://localhost:5228/api/Vendor', {
          name: formData.name,
          description: formData.description, // Include the description for Vendor
        });
      }

      alert('New Back Officer added successfully!');
      onBackOfficerAdded(); // Callback to refresh the list and return to table
    } catch (error) {
      console.error('Error adding back officer:', error);
      alert('Failed to add back officer');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm position-relative">
      {/* Close Button Positioned at Top Right */}
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 m-3"
        aria-label="Close"
        onClick={onBackOfficerAdded}
      />
      
      <h4>Add New Back Officer</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter back officer's name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Form.Group controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="Administrator">Administrator</option>
            <option value="Vendor">Vendor</option>
            <option value="CSR">CSR</option>
          </Form.Control>
        </Form.Group>

        {/* Show description field only if the role is "Vendor" */}
        {formData.role === 'Vendor' && (
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description for vendor"
              required
            />
          </Form.Group>
        )}

        <Button className="purple-button mt-3" type="submit">
          Add Back Officer
        </Button>
      </Form>
    </div>
  );
};

export default AddBackOfficerForm;
