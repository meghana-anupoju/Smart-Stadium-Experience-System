import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useSimulator } from './store/SimulatorContext.jsx';

// Route-level code splitting for efficiency
const Home = lazy(() => import('./pages/Home.jsx'));
const Navigation = lazy(() => import('./pages/Navigation.jsx'));
const Food = lazy(() => import('./pages/Food.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const { isEmergency } = useSimulator();

  return (
    <div className={`app-container ${isEmergency ? 'emergency-mode' : ''}`}>
      {/* Dynamic Emergency Background Override */}
      {isEmergency && <div className="emergency-overlay" aria-live="assertive" aria-label="Emergency evacuation in progress" />}

      <main className="app-content">
        <Suspense fallback={<div className="page-loader" role="status" aria-label="Loading page..."><div className="loader-spinner" /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nav" element={<Navigation />} />
            <Route path="/food" element={<Food />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <BottomNav />}
    </div>
  );
}

export default App;
