import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute: Guards admin-only routes.
 * Checks sessionStorage for 'adminAuthorized' flag.
 * To access admin, open browser console and run:
 *   sessionStorage.setItem('adminAuthorized', 'true')
 */
const ProtectedRoute = ({ children }) => {
  const isAuthorized = sessionStorage.getItem('adminAuthorized') === 'true';

  if (!isAuthorized) {
    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          gap: '1rem',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <span style={{ fontSize: '3rem' }}>🔒</span>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '280px' }}>
          This area is for authorized staff only. Please log in with admin credentials.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            const pin = prompt('Enter admin PIN:');
            if (pin === '1234') {
              sessionStorage.setItem('adminAuthorized', 'true');
              window.location.reload();
            } else if (pin !== null) {
              alert('Incorrect PIN. Access denied.');
            }
          }}
        >
          Staff Login
        </button>
        <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ← Return to Home
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
