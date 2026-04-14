import React, { useState } from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { Clock, CheckCircle } from 'lucide-react';

const Food = () => {
  const { stalls } = useSimulator();
  const [orderStall, setOrderStall] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);

  const sortedStalls = [...stalls].sort((a, b) => a.waitTime - b.waitTime);

  const handleOrder = (stallId) => {
    setOrderStall(stallId);
    setTimeout(() => {
      setOrderComplete(true);
      setTimeout(() => {
        setOrderComplete(false);
        setOrderStall(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex-col gap-4">
      <h2>Food & Facilities</h2>
      <p className="text-muted" style={{ marginBottom: '1rem' }}>Smart Queue dynamically routes you to the fastest stalls.</p>

      {orderComplete && (
        <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'var(--success)', textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
          <h3>Order Reserved!</h3>
          <p>Your token is <strong>#A492</strong>. Proceed to pick up lane when ready.</p>
        </div>
      )}

      {!orderComplete && sortedStalls.map((stall, index) => (
        <div key={stall.id} className="glass-panel flex-row justify-between" style={{ 
          borderColor: index === 0 ? 'var(--primary)' : 'var(--glass-border)',
          background: index === 0 ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-card)'
        }}>
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {stall.name}
              {index === 0 && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Fastest</span>}
            </h4>
            <div className="flex-row gap-2 mt-4 text-muted">
              <Clock size={16} />
              <span>~{stall.waitTime} min wait</span>
            </div>
          </div>
          
          <button 
            className="btn btn-primary" 
            onClick={() => handleOrder(stall.id)}
            disabled={orderStall === stall.id}
          >
            {orderStall === stall.id ? 'Processing...' : 'Reserve'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Food;
