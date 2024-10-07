import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const CustomerFeedbackTable = () => {
  const [comments, setComments] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  
  useEffect(() => {
    const fetchComments = async () => {
      const vendorId = localStorage.getItem('vendorId'); // Make sure vendorId is correct
      console.log('Vendor ID:', vendorId); // Log the vendor ID to check if it's available
  
      if (!vendorId) {
        console.error('No vendorId found in localStorage');
        return; // Exit if vendorId is missing
      }
  
      try {
        const response = await axios.get(`${baseUrl}api/Vendor/${vendorId}/comments`); 
        // Set comments from the response
        setComments(response.data.comments); 
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };
  
    fetchComments();
  }, []);

  return (
    <div className="p-4 bg-white shadow-sm">
      <h4>Customer Feedback</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Comment</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={index}>
              <td>{comment.customerName}</td>
              <td>{comment.text}</td>
              <td>{comment.ranking}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerFeedbackTable;
