import React, { useEffect } from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { Bell, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logAnalyticsEvent } from '../firebase.js';

const alertIconMap = {
  danger: <Activity color="var(--danger)" aria-hidden="true" />,
  warning: <Bell color="var(--warning)" aria-hidden="true" />,
  info: <MapPin color="var(--primary)" aria-hidden="true" />,
};

const Home = () => {
  const { alerts, isEmergency } = useSimulator();
  const navigate = useNavigate();

  // Analytics: track page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page_title: 'Home', page_path: '/' });
  }, []);

  return (
    <section aria-labelledby="home-heading" className="flex-col gap-4">
      <h1 id="home-heading" className="sr-only">Smart Stadium Home</h1>

      <div className="glass-panel ticket-panel" aria-label="Your stadium ticket">
        <h2 className="title-gradient">Stadium Pass</h2>
        <div className="qr-wrapper">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket12345&color=4f46e5&bgcolor=ffffff"
            alt="QR code for ticket number 12345"
            width="150"
            height="150"
            style={{ borderRadius: '8px' }}
          />
        </div>
        <p className="text-muted">Section 104 • Row H • Seat 23</p>
      </div>

      <div className="flex-row justify-between" style={{ alignItems: 'baseline' }}>
        <h2>Live Updates</h2>
        <span className="badge badge-success" role="status" aria-live="polite">Match in Progress</span>
      </div>

      <ul aria-label="Live stadium alerts" className="flex-col gap-2" style={{ listStyle: 'none', padding: 0 }}>
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="glass-panel flex-row gap-2 alert-item"
            style={{
              padding: '1rem',
              borderColor: alert.type === 'danger' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--glass-border)'
            }}
            role="alert"
          >
            {alertIconMap[alert.type] || alertIconMap.info}
            <div>
              <p style={{ fontSize: '0.9rem' }}>{alert.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="glass-panel quick-steps-panel">
        <h2>Quick Next Steps</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          It&apos;s half-time soon. Order food now to beat the rush!
        </p>
        <button
          id="order-food-btn"
          className="btn btn-primary w-full"
          onClick={() => {
            logAnalyticsEvent('cta_click', { button: 'order_food', source: 'home' });
            navigate('/food');
          }}
          aria-label="Go to food ordering page"
        >
          Order Food
        </button>
      </div>
    </section>
  );
};

export default Home;
