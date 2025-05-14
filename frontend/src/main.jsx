import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-react'; // Clerk authentication
import { BrowserRouter as Router } from 'react-router-dom'; // For routing
import { config } from './config'; // Import config file for Clerk's publishable key
import App from './App'; // Main App component
import "./index.css"; // Global styles

const { clerkPublishableKey } = config; // Get the Clerk publishable key from config file

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <Router>
      <App />
    </Router>
  </ClerkProvider>
);
