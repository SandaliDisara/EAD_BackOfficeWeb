import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/tablesRender.css';
import AddButton from './AddButton'; // Moved the AddButton here

const VendorProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store selected product for updating stock
  const [newStock, setNewStock] = useState(''); // State to store the new stock value

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch vendor's products from API on component load
  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const backOfficerDetails = JSON.parse(localStorage.getItem('backofficerDetails'));
        const vendorId = backOfficerDetails?.id;

        if (!vendorId) {
          setError('Vendor ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}api/products/vendor/${vendorId}`);
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching vendor products');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, [baseUrl]);

  // Handle product stock update
  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock); // Prepopulate with current stock value
    setShowModal(true); // Show the modal for stock update
  };

  const handleSaveStock = async () => {
    try {
      await axios.put(`${baseUrl}api/products/${selectedProduct.id}`, {
        ...selectedProduct,
        stock: newStock, // Update the stock value
      });
      // Update the UI to reflect the new stock value
      setProducts(products.map(p => (p.id === selectedProduct.id ? { ...p, stock: newStock } : p)));
      setShowModal(false); // Close the modal after saving
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) return <p>Loading vendor products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Vendor Products</h4>
        <div>
          <AddButton /> {/* "Add New" button moved here */}
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
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No products available</td>
            </tr>
          ) : (
            products.map(product => (
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
                <td>
                  {/* Apply Bootstrap styles for a better button */}
                  <Button 
                    variant="primary" // Bootstrap primary style
                    size="sm" // Small size for better fit
                    onClick={() => handleUpdateStock(product)}
                  >
                    Update Stock
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for updating stock */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock for {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStock">
              <Form.Label>New Stock</Form.Label>
              <Form.Control 
                type="number" 
                value={newStock} 
                onChange={(e) => setNewStock(e.target.value)} 
                min="0" // Ensure stock is not negative
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveStock}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorProductsTable;
