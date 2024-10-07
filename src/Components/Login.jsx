import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection after login
import axios from 'axios';
import '../Styles/loginStyles.css'; // Import custom styles

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log(`Sending request to ${baseUrl}api/BackOfficer/login`); // Debug URL
            const response = await axios.post(`${baseUrl}api/BackOfficer/login`, { username, password });
            
            console.log('Response:', response); // Log response for debugging
    
            if (response.status === 200) {
                // Store the backofficer details in localStorage
                const backOfficerDetails = {
                    id: response.data.id,
                    username: response.data.username,
                    role: response.data.role,
                };

                localStorage.setItem('backofficerDetails', JSON.stringify(backOfficerDetails));

                // If the logged-in user is a Vendor, store vendorId in localStorage
                if (response.data.role === 'Vendor') {
                    localStorage.setItem('vendorId', response.data.id);
                }

                // Pass username, id and role to the dashboard via state
                navigate('/dashboard', { state: { username: response.data.username, role: response.data.role, id: response.data.id } });
            }
        } catch (error) {
            console.error('Login error:', error); // Log error details
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <h1>Normy Clothing</h1>
                <p>Your perfect fashion partner!</p>
            </div>
            <div className="login-right">
                <div className="login-form">
                    <h3 className="card-title text-center">Back Officer Login</h3>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-3">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
