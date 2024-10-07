import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/tablesRender.css'; // Add custom styles here if needed

const VendorOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const vendorId = localStorage.getItem('vendorId'); // Assume vendorId is stored in localStorage

  // Fetch orders containing products of the logged-in vendor
  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/Order/vendor/${vendorId}`); // Adjust the API URL
        setOrders(response.data); // Set fetched orders to the state
        const customerIds = response.data.map(order => order.customerId);
        fetchCustomerNames(customerIds); // Fetch customer names after fetching orders
      } catch (error) {
        console.error('Error fetching vendor orders:', error);
      }
    };

    fetchVendorOrders();
  }, [vendorId]);

  // Fetch customer names for each customerId and store them in state
  const fetchCustomerNames = async (customerIds) => {
    const names = {};
    try {
      for (const id of customerIds) {
        const response = await axios.get(`${baseUrl}api/Customer/${id}`); // Fetch customer details
        const { firstName, lastName } = response.data;
        names[id] = `${firstName} ${lastName}`; // Concatenate first and last name
      }
      setCustomerNames(names); // Update the state with customer names
    } catch (error) {
      console.error('Error fetching customer names:', error);
    }
  };

  // Handle product status change initiation
  const handleProductStatusChange = (order, product, status) => {
    setSelectedProduct({ order, product });
    setNewStatus(status);
    setShowModal(true); // Show the confirmation modal
  };

  // Confirm the product status update
  const confirmProductStatusUpdate = async () => {
    try {
      const { order, product } = selectedProduct;
      const status = newStatus;

      // Send PUT request to update product status
      await axios.put(`${baseUrl}api/Order/${order.id}/products/${product.productId}/status`, `"${status}"`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the product status in the UI
      setOrders(orders.map(o =>
        o.id === order.id
          ? {
              ...o,
              products: o.products.map(p =>
                p.productId === product.productId ? { ...p, productStatus: status } : p
              ),
            }
          : o
      ));

      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Vendor Product Orders</h4>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Total Price</th>
            <th>Order Date</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{customerNames[order.customerId] || order.customerId}</td> 
              <td>{order.address}</td>
              <td>Rs.{order.totalPrice.toFixed(2)}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>
                <ul>
                  {order.products
                    .filter(product => product.vendorId === vendorId) // Filter products by the logged-in vendor
                    .map(product => (
                      <li key={product.productId}>
                        {product.productName} (Qty: {product.quantity}) - Status: {product.productStatus}{' '}
                        <Dropdown>
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {product.productStatus}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleProductStatusChange(order, product, 'Ordered')}>
                              Ordered
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleProductStatusChange(order, product, 'Processing')}>
                              Processing
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleProductStatusChange(order, product, 'Delivered')}>
                              Delivered
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Modal for product status update */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Product Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status of this product to "{newStatus}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmProductStatusUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorOrderManagement;
