import React, { useState, useCallback, useEffect } from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { AlertOctagon, Send, LogOut, User } from 'lucide-react';
import { logAnalyticsEvent } from '../firebase.js';
import { useAuth } from '../store/AuthContext.jsx';

// Strict input sanitizer — strips HTML tags and limits length
const sanitizeInput = (str) => str.replace(/<[^>]*>/g, '').slice(0, 200);

const Admin = () => {
  const { zones, pushAlert, triggerEmergency, clearEmergency, isEmergency } = useSimulator();
  const { user, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [inputError, setInputError] = useState('');

  // Analytics: page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page_title: 'Admin Command Center', page_path: '/admin' });
  }, []);

  const handleMessageChange = useCallback((e) => {
    const raw = e.target.value;
    const sanitized = sanitizeInput(raw);
    setMessage(sanitized);
    if (raw !== sanitized) {
      setInputError('HTML tags are not allowed in messages.');
    } else if (raw.length > 200) {
      setInputError('Message must be 200 characters or fewer.');
    } else {
      setInputError('');
    }
  }, []);

  const handleSendAlert = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || inputError) return;
    pushAlert(trimmed, 'info');
    logAnalyticsEvent('admin_broadcast', { message_length: trimmed.length });
    setMessage('');
  }, [message, inputError, pushAlert]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendAlert();
  };

  const handleLogout = async () => {
    logAnalyticsEvent('admin_logout');
    await logout();
  };

  return (
    <section aria-labelledby="admin-heading" className="flex-col gap-4">

      {/* Header */}
      <div className="flex-row justify-between admin-header">
        <h1 id="admin-heading" style={{ margin: 0 }}>Command Center</h1>
        <span className="badge badge-warning" role="status">Admin</span>
      </div>

      {/* Logged-in user chip */}
      {user && (
        <div className="glass-panel flex-row justify-between" style={{ padding: '0.75rem 1rem' }}>
          <div className="flex-row gap-2">
            <User size={16} aria-hidden="true" color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.displayName || user.email || 'Admin User'}
            </span>
          </div>
          <button
            id="logout-btn"
            className="btn"
            onClick={handleLogout}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}
            aria-label="Sign out of admin account"
          >
            <LogOut size={14} aria-hidden="true" /> Sign Out
          </button>
        </div>
      )}

      {/* Crowd Density */}
      <div className="glass-panel" role="region" aria-labelledby="density-heading">
        <h2 id="density-heading">Live Crowd Density</h2>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Data simulated from stadium sensors — synced to Firestore.
        </p>

        <ul aria-label="Zone crowd density levels" className="flex-col gap-2" style={{ listStyle: 'none', padding: 0 }}>
          {zones.map(zone => {
            const color = zone.density > 80 ? 'var(--danger)' : zone.density > 50 ? 'var(--warning)' : 'var(--success)';
            const label = zone.density > 80 ? 'High' : zone.density > 50 ? 'Moderate' : 'Low';
            return (
              <li key={zone.id} className="flex-col gap-2" style={{ marginBottom: '0.5rem' }}>
                <div className="flex-row justify-between" style={{ fontSize: '0.9rem' }}>
                  <span>{zone.name}</span>
                  <span style={{ color }} aria-label={`${zone.density}% capacity — ${label} crowd`}>
                    {zone.density}% Capacity
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={zone.density}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${zone.name} crowd density: ${zone.density}%`}
                  style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: `${zone.density}%`, height: '100%', background: color, transition: 'width 0.5s ease' }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Broadcast Alert */}
      <div className="glass-panel" role="region" aria-labelledby="broadcast-heading">
        <h2 id="broadcast-heading">Broadcast Alert</h2>
        <div className="flex-row gap-2 mt-4">
          <label htmlFor="broadcast-input" className="sr-only">Message to broadcast to all users</label>
          <input
            id="broadcast-input"
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type message to all users..."
            maxLength={200}
            aria-describedby={inputError ? 'broadcast-error' : undefined}
            aria-invalid={!!inputError}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${inputError ? 'var(--danger)' : 'var(--glass-border)'}`, background: 'rgba(0,0,0,0.3)', color: 'white' }}
          />
          <button
            id="send-alert-btn"
            className="btn btn-primary"
            onClick={handleSendAlert}
            disabled={!message.trim() || !!inputError}
            aria-label="Send broadcast alert to all users"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
        {inputError && (
          <p id="broadcast-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {inputError}
          </p>
        )}
        <p aria-live="polite" className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
          {message.length}/200 characters
        </p>
      </div>

      {/* Emergency Controls */}
      <div
        className="glass-panel"
        role="region"
        aria-labelledby="emergency-heading"
        style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}
      >
        <h2 id="emergency-heading" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertOctagon size={24} aria-hidden="true" /> Emergency Controls
        </h2>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          Triggering an emergency will override all user navigation features and guide them to nearest exits.
        </p>

        {isEmergency ? (
          <button
            id="resolve-emergency-btn"
            className="btn w-full"
            style={{ background: 'var(--success)', color: 'white' }}
            onClick={clearEmergency}
            aria-label="Resolve emergency and return to normal operations"
          >
            Resolve Emergency (All Clear)
          </button>
        ) : (
          <button
            id="trigger-emergency-btn"
            className="btn btn-danger pulse w-full"
            onClick={triggerEmergency}
            aria-label="Trigger evacuation protocol for all stadium zones"
          >
            TRIGGER EVACUATION PROTOCOL
          </button>
        )}
      </div>
    </section>
  );
};

export default Admin;
