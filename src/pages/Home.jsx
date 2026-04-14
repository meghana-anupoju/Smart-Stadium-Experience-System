import React from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { Bell, MapPin, Activity } from 'lucide-react';

const Home = () => {
  const { alerts, isEmergency } = useSimulator();

  return (
    <div className="flex-col gap-4">
      <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '1rem', borderTop: '4px solid var(--primary)' }}>
        <h2 className="title-gradient">Stadium Pass</h2>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'inline-block', margin: '1rem 0' }}>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket12345&color=4f46e5&bgcolor=ffffff" alt="Ticket QR" style={{ borderRadius: '8px' }} />
        </div>
        <p className="text-muted">Section 104 • Row H • Seat 23</p>
      </div>

      <div className="flex-row justify-between" style={{ alignItems: 'baseline' }}>
        <h3>Live Updates</h3>
        <span className="badge badge-success">Match in Progress</span>
      </div>

      <div className="flex-col gap-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="glass-panel flex-row gap-2" style={{ padding: '1rem', borderColor: alert.type === 'danger' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--glass-border)' }}>
            {alert.type === 'danger' && <Activity color="var(--danger)" />}
            {alert.type === 'warning' && <Bell color="var(--warning)" />}
            {alert.type === 'info' && <MapPin color="var(--primary)" />}
            <div>
              <p style={{ fontSize: '0.9rem' }}>{alert.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel mt-4" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)' }}>
        <h4>Quick Next Steps</h4>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>It's half-time soon. Order food now to beat the rush!</p>
        <button className="btn btn-primary w-full">Order Food</button>
      </div>
    </div>
  );
};

export default Home;
