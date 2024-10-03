import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch in v6
import './index.css';
import App from './App';
import LoginComponent from './Components/Login'; // Import your LoginComponent
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Route for login */}
        <Route path="/login" element={<LoginComponent />} />
        
        {/* Route for the app/dashboard */}
        <Route path="/dashboard" element={<App />} />
        
        {/* Default route, redirect to login */}
        <Route path="/" element={<LoginComponent />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
