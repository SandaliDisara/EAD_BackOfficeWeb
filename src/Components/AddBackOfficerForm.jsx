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

  const baseUrl = process.env.REACT_APP_BASE_URL;

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
      //Create the Back Officer and get the ID
      const backOfficerResponse = await axios.post(`${baseUrl}api/BackOfficer`, formData);
      const backOfficerId = backOfficerResponse.data.id; // Assuming this returns the new ID
  
      // If the selected role is "Vendor", also create the Vendor using the same ID
      if (formData.role === 'Vendor') {
        const vendorData = {
          ...formData, // Copy other form data like name, description
          id: backOfficerId, // Use the same ID for the Vendor
          description: formData.description, // Assuming 'description' field exists for Vendor
        };

        await axios.post(`${baseUrl}api/Vendor`, vendorData);
        alert('Vendor and Back Officer created successfully!');
      } else {
        alert('Back Officer created successfully!');
      }
      onBackOfficerAdded(); // Callback to refresh the list
    } catch (error) {
      console.error('Error adding back officer or vendor:', error);
      alert('Failed to add back officer or vendor');
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
