import React, { useState, useCallback, useEffect } from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';
import { Clock, CheckCircle } from 'lucide-react';
import { logAnalyticsEvent, saveOrderToFirestore } from '../firebase.js';

const Food = () => {
  const { stalls } = useSimulator();
  const [orderStall, setOrderStall] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderToken, setOrderToken] = useState('#A492');

  const sortedStalls = [...stalls].sort((a, b) => a.waitTime - b.waitTime);

  // Analytics: page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page_title: 'Food & Facilities', page_path: '/food' });
  }, []);

  const handleOrder = useCallback(async (stall) => {
    setOrderStall(stall.id);
    logAnalyticsEvent('food_order_initiated', { stall_id: stall.id, stall_name: stall.name, wait_time: stall.waitTime });

    // Save order to Firestore
    const docId = await saveOrderToFirestore(stall.id, stall.name, stall.waitTime);
    const token = `#A${Math.floor(Math.random() * 900 + 100)}`;
    setOrderToken(token);

    setTimeout(() => {
      setOrderComplete(true);
      logAnalyticsEvent('food_order_completed', { stall_id: stall.id, token });
      setTimeout(() => {
        setOrderComplete(false);
        setOrderStall(null);
      }, 3000);
    }, 1000);
  }, []);

  return (
    <section aria-labelledby="food-heading" className="flex-col gap-4">
      <h1 id="food-heading">Food &amp; Facilities</h1>
      <p className="text-muted" style={{ marginBottom: '1rem' }}>
        Smart Queue dynamically routes you to the fastest stalls.
      </p>

      {orderComplete && (
        <div
          className="glass-panel order-success-panel"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <CheckCircle size={48} color="var(--success)" aria-hidden="true" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h2>Order Reserved!</h2>
          <p>
            Your token is <strong>{orderToken}</strong>. Proceed to pick up lane when ready.
          </p>
        </div>
      )}

      {!orderComplete && (
        <ul aria-label="Food stalls sorted by wait time" style={{ listStyle: 'none', padding: 0 }} className="flex-col gap-4">
          {sortedStalls.map((stall, index) => (
            <li
              key={stall.id}
              className="glass-panel flex-row justify-between"
              style={{
                borderColor: index === 0 ? 'var(--primary)' : 'var(--glass-border)',
                background: index === 0 ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-card)'
              }}
            >
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  {stall.name}
                  {index === 0 && (
                    <span className="badge badge-success" style={{ fontSize: '0.6rem' }} aria-label="Fastest option">
                      Fastest
                    </span>
                  )}
                </h2>
                <div className="flex-row gap-2 mt-4 text-muted" aria-label={`Wait time: approximately ${stall.waitTime} minutes`}>
                  <Clock size={16} aria-hidden="true" />
                  <span>~{stall.waitTime} min wait</span>
                </div>
              </div>

              <button
                id={`reserve-btn-${stall.id}`}
                className="btn btn-primary"
                onClick={() => handleOrder(stall)}
                disabled={orderStall === stall.id}
                aria-label={`Reserve spot at ${stall.name}, wait time ${stall.waitTime} minutes`}
                aria-busy={orderStall === stall.id}
              >
                {orderStall === stall.id ? 'Processing...' : 'Reserve'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Food;
