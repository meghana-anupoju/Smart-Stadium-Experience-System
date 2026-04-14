import React, { useState } from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { AlertOctagon, Send } from 'lucide-react';

const Admin = () => {
  const { zones, pushAlert, triggerEmergency, clearEmergency, isEmergency } = useSimulator();
  const [message, setMessage] = useState('');

  const handleSendAlert = () => {
    if (message.trim() === '') return;
    pushAlert(message, 'info');
    setMessage('');
  };

  return (
    <div className="flex-col gap-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Command Center</h2>
        <span className="badge badge-warning">Admin Authorized</span>
      </div>

      <div className="glass-panel">
        <h3>Live Crowd Density</h3>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Data simulated from stadium sensors.</p>
        
        <div className="flex-col gap-2">
          {zones.map(zone => (
            <div key={zone.id} className="flex-col gap-2" style={{ marginBottom: '0.5rem' }}>
              <div className="flex-row justify-between" style={{ fontSize: '0.9rem' }}>
                <span>{zone.name}</span>
                <span style={{ color: zone.density > 80 ? 'var(--danger)' : zone.density > 50 ? 'var(--warning)' : 'var(--success)' }}>
                  {zone.density}% Capacity
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${zone.density}%`, 
                  height: '100%', 
                  background: zone.density > 80 ? 'var(--danger)' : zone.density > 50 ? 'var(--warning)' : 'var(--success)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel">
        <h3>Broadcast Alert</h3>
        <div className="flex-row gap-2 mt-4">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message to all users..."
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
          />
          <button className="btn btn-primary" onClick={handleSendAlert}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertOctagon size={24} /> Emergency Controls
        </h3>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Triggering an emergency will override all user navigation features and guide them to nearest exits.</p>
        
        {isEmergency ? (
          <button className="btn w-full" style={{ background: 'var(--success)', color: 'white' }} onClick={clearEmergency}>
            Resolve Emergency (All Clear)
          </button>
        ) : (
          <button className="btn btn-danger pulse w-full" onClick={triggerEmergency}>
            TRIGGER EVACUATION PROTOCOL
          </button>
        )}
      </div>
      
      <div className="text-center mt-4">
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>← Return to User View</a>
      </div>
    </div>
  );
};

export default Admin;
