import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SimulatorProvider } from './store/SimulatorContext.jsx';
import { AuthProvider } from './store/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SimulatorProvider>
          <App />
        </SimulatorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
