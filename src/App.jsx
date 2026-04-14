import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Navigation from './pages/Navigation.jsx';
import Food from './pages/Food.jsx';
import Admin from './pages/Admin.jsx';
import { useSimulator } from './store/SimulatorContext.jsx';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const { isEmergency } = useSimulator();

  return (
    <div className={`app-container ${isEmergency ? 'emergency-mode' : ''}`}>
      {/* Dynamic Emergency Background Override */}
      {isEmergency && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(239, 68, 68, 0.15)',
          pointerEvents: 'none',
          animation: 'pulse-glow 1s infinite alternate',
          zIndex: 1000
        }} />
      )}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nav" element={<Navigation />} />
          <Route path="/food" element={<Food />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      
      {!isAdmin && <BottomNav />}
    </div>
  );
}

export default App;
