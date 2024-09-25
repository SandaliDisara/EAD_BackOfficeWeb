import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from API on component load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5228/api/products'); // Update the URL based on your API
        setProducts(response.data); // Set the fetched products to the state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5228/api/products/${id}`); // Update the URL based on your API
      setProducts(products.filter(product => product.id !== id)); // Remove deleted product from UI
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Products</h4>
        <div>
          <Button variant="primary" className="mr-2">Add New</Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <img src="https://via.placeholder.com/50" alt="Product Avatar" className="rounded-circle" />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>{product.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button variant="link" className="text-primary">Edit</Button>
                <Button variant="link" className="text-danger" onClick={() => handleDelete(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTable;
