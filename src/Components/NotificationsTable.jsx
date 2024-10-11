import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [userRole, setUserRole] = useState(null); // State to store the user's role

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch user role from local storage or context (assumes you store it there)
    const backOfficerData = JSON.parse(localStorage.getItem('backofficerDetails'));
    if (backOfficerData && backOfficerData.role) {
      setUserRole(backOfficerData.role);
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/Notification`); 
        setNotifications(response.data); // Set notifications from the response
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [baseUrl]);

  // Function to handle the approval of order cancellation
  const handleApproveCancel = async (notificationId, orderId) => {
    const isConfirmed = window.confirm("Are you sure you want to approve the order cancellation?");
    if (!isConfirmed) return;

    try {
      // Call the backend API to delete the order
      await axios.delete(`${baseUrl}api/Order/${orderId}`);
      console.log(`Order ID: ${orderId} has been cancelled.`);

      // Optionally, remove the notification from the state after successful deletion
      setNotifications(notifications.filter(notification => notification.notificationId !== notificationId));

      // Show success message (optional)
      alert('Order cancellation has been approved and the order has been cancelled.');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('There was an error cancelling the order. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <h4>Notifications</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Customer ID</th>
            <th>Date of Creation</th>
            <th>Action</th> {/* New column for action buttons */}
          </tr>
        </thead>
        <tbody>
          {notifications
            .filter(notification => !(userRole === 'Vendor' && notification.title === "Order Cancelling")) // Filter out notifications for Vendors
            .map((notification) => (
              <tr key={notification.notificationId}>
                <td>{notification.title}</td>
                <td>{notification.body}</td>
                <td>{notification.senderId}</td>
                <td>{new Date(notification.dateOfCreation).toLocaleString()}</td> {/* Format date */}
                <td>
                  {notification.title === "Order Cancelling" && ( // Conditional rendering of the button
                    <Button 
                      variant="success" 
                      onClick={() => handleApproveCancel(notification.notificationId, notification.orderId)} // Pass orderId to the handler
                    >
                      Approve Order Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default NotificationsTable;
