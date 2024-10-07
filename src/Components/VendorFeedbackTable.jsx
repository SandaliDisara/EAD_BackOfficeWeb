import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap'; // Import Bootstrap Table
import axios from 'axios';
import '../Styles/tablesRender.css'; // Assuming you want to apply custom table styles

const VendorFeedbackTable = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorFeedback = async () => {
      try {
        const backOfficerDetails = JSON.parse(localStorage.getItem('backofficerDetails'));
        const vendorId = backOfficerDetails?.id;

        if (!vendorId) {
          setError('Vendor ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/vendor/${vendorId}`);
        setFeedback(response.data.comments); 
      } catch (error) {
        setError('Error fetching feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorFeedback();
  }, []);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Vendor Feedback</h4>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Comment</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {feedback.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No feedback available</td>
            </tr>
          ) : (
            feedback.map((comment, index) => (
              <tr key={index}>
                <td>{comment.customerName}</td>
                <td>{comment.text}</td>
                <td>{comment.ranking}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default VendorFeedbackTable;
