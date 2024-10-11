import React, { useState, useEffect } from 'react';
import { Table, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/tablesRender.css';

const ProductsTable = () => {
  const [products, setProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [selectedCategory, setSelectedCategory] = useState('All'); // Store the selected category

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // List of predefined categories
  const categories = ['All', 'laptop', 'tv', 'mobile', 'accessories', 'camera'];

  // Fetch products from API on component load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/products`);
      const productData = response.data;
      setProducts(productData); // Set fetched products to state
      setFilteredProducts(productData); // Set initially filtered products to all products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle category filter change
  const handleCategoryFilterChange = (category) => {
    setSelectedCategory(category); // Update the selected category state

    if (category === 'All') {
      setFilteredProducts(products); // Show all products if 'All' is selected
    } else {
      setFilteredProducts(products.filter(product => product.category === category)); // Filter by selected category
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}api/products/${id}`);
      const updatedProducts = products.filter(product => product.id !== id); // Remove deleted product from the products list
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts.filter(product => product.category === selectedCategory || selectedCategory === 'All')); // Update filtered products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle deactivating a category (for demo purposes, just log it)
  const handleDeactivateCategory = () => {
    console.log(`Category "${selectedCategory}" deactivated.`);
    // Here you can add logic to handle deactivating the category, such as an API call.
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {/* Toggle Buttons for filtering products by category */}
          <ToggleButtonGroup
            type="radio"
            name="categories"
            value={selectedCategory}
            onChange={handleCategoryFilterChange}
            className="mb-3"
          >
            {categories.map((category, index) => (
              <ToggleButton key={index} id={`tbg-btn-${index}`} value={category} variant="outline-primary">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {/* "Deactivate Category" button, shown only when a specific category is selected */}
        {selectedCategory !== 'All' && (
          <Button
            variant="danger"
            onClick={handleDeactivateCategory}
            className="ms-auto" // Align to the right
          >
            Deactivate Category
          </Button>
        )}
      </div>

      {/* Products Table */}
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.imageURL || 'https://via.placeholder.com/50'}
                    alt="Product"
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>Rs.{product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button variant="link" className="text-primary">Edit</Button>
                  <Button variant="link" className="text-danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No products available for the selected category.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTable;
