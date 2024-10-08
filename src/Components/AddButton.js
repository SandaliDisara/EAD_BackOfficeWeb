import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/tablesRender.css';

const AddButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: null
  });

  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Get VendorID from localStorage (or replace this logic to fit your needs)
  const vendorID = localStorage.getItem('vendorId'); 
  console.log("Fetched VendorID from localStorage:", vendorID);  // Log the VendorID

  // Open modal
  const handleOpenModal = () => setShowModal(true);

  // Close modal
  const handleCloseModal = () => setShowModal(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
    console.log(`Updated ${name}:`, value);  // Log changes to form inputs
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setProductData({
      ...productData,
      image: e.target.files[0]  // Store the file
    });
    console.log("Selected Image File:", e.target.files[0]);  // Log the selected image file
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted. Current product data:", productData);  // Log form submission data

    try {
      // Step 1: Upload image to Cloudinary
      console.log("Uploading image to Cloudinary...");  // Log before starting image upload
      const imageUrl = await uploadImageToCloudinary(productData.image);
      console.log("Image uploaded to Cloudinary. Image URL:", imageUrl);  // Log Cloudinary image URL

      // Step 2: Submit product data along with image URL to your MongoDB API
      const newProduct = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        imageURL: imageUrl,  // The URL from Cloudinary
        vendorID: vendorID || 'default-vendor-id',   // Ensure the vendorID is present
        isActive: true  // Set isActive to true by default
      };

      console.log("Submitting new product:", newProduct); // Log the final payload before sending to API

      const response = await axios.post(`${baseUrl}api/Products`, newProduct);  // Replace with your API endpoint
      console.log("API Response:", response.data);  // Log the API response

      // Close the modal and reset form
      setShowModal(false);
      setProductData({ name: '', description: '', price: 0, category: '', stock: 0, image: null });
    } catch (error) {
      if (error.response) {
        console.error("API Error Response:", error.response.data);  // Log server error message
      } else if (error.request) {
        console.error("No response received:", error.request);  // Log if no response was received
      } else {
        console.error("Error during request setup:", error.message);  // Log request setup error
      }
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'EAD_Images');  // Add your Cloudinary preset here

    try {
      console.log("Uploading image to Cloudinary with formData:", formData);  // Log formData before upload
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dvumcfocl/image/upload`,
        formData
      );
      return response.data.secure_url;  // Return the secure URL for the uploaded image
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);  // Log Cloudinary upload errors
      throw error;
    }
  };

  return (
    <>
      {/* Button to trigger modal */}
      <button onClick={handleOpenModal} className="btn btn-primary purple-button">
        Add New
      </button>

      {/* Modal structure */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title className="w-100 text-center">Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" name="name" value={productData.name} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={productData.description} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={productData.price} onChange={handleInputChange} required />
            </Form.Group>

            {/* Category Dropdown */}
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={productData.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="mobile">Mobile Phones</option>
                <option value="laptop">Laptops</option>
                <option value="tablet">Tablets</option>
                <option value="camera">Cameras</option>
                <option value="accessories">Accessories</option>
                <option value="tv">Televisions</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={productData.stock} onChange={handleInputChange} required />
            </Form.Group>

            {/* Image Upload Field */}
            <Form.Group controlId="formImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} required />
            </Form.Group>

            {/* Centered Submit Button */}
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddButton;
