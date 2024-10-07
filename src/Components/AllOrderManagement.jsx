import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/tablesRender.css'; // Add custom styles here if needed

const AllOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch orders from API on component load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/Order`); // Adjust the API URL as per your backend setup
        setOrders(response.data); // Set fetched orders to the state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}api/Order/${id}`); // Adjust the delete API endpoint as per your backend
      setOrders(orders.filter(order => order.id !== id)); // Remove deleted order from the UI
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Handle order status change initiation
  const handleStatusChange = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setShowModal(true); // Show the confirmation modal
  };

  const confirmStatusUpdate = async () => {
    try {
        
        const status = newStatus; // newStatus holds the selected status

        // Send PUT request to update order status (replace POST with PUT)
        await axios.put(`${baseUrl}api/Order/${selectedOrder.id}/status`, `"${status}"`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update the order status in the UI
        setOrders(orders.map(order =>
            order.id === selectedOrder.id ? { ...order, orderStatus: status } : order
        ));
      
        setShowModal(false); // Close the modal
    } catch (error) {
        console.error('Error updating order status:', error);
    }
};

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Order Management</h4>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Address</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Products</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerId}</td>
              <td>{order.address}</td>
              <td>Rs.{order.totalPrice.toFixed(2)}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {order.orderStatus}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleStatusChange(order, 'Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusChange(order, 'Dispatched')}>Dispatched</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusChange(order, 'Delivered')}>Delivered</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusChange(order, 'PartiallyDelivered')}>Partially Delivered</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>
                <ul>
                  {order.products.map(product => (
                    <li key={product.productId}>
                      {product.productName} (Qty: {product.quantity}) - {product.productStatus}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <Button variant="link" className="text-danger" onClick={() => handleDelete(order.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Modal for status update */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status of this order to "{newStatus}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllOrderManagement;
