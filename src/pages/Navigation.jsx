import React from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';

const Navigation = () => {
  const { zones, isEmergency } = useSimulator();

  const leastCrowdedGate = zones
    .filter(z => z.id.includes('gate'))
    .sort((a, b) => a.density - b.density)[0];

  const getDensityColor = (density) => {
    if (density < 50) return 'var(--success)';
    if (density < 80) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getDensityLabel = (density) => {
    if (density < 50) return 'Low crowd';
    if (density < 80) return 'Moderate crowd';
    return 'High crowd';
  };

  return (
    <section aria-labelledby="nav-heading" className="flex-col gap-4" style={{ height: '100%' }}>
      <div className="flex-row justify-between">
        <h1 id="nav-heading">Live Map</h1>
        {isEmergency && (
          <span className="badge badge-danger pulse" role="alert" aria-live="assertive">
            EVACUATION
          </span>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div
          role="img"
          aria-label="Stadium map showing crowd density across zones"
          style={{ position: 'relative', width: '100%', height: '300px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', overflow: 'hidden' }}
        >
          {/* North Stand */}
          <div
            style={{ position: 'absolute', top: '10%', left: '30%', width: '40%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'north-stand')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}
            aria-label={`North Stand: ${getDensityLabel(zones.find(z => z.id === 'north-stand')?.density)}`}
          >
            North Stand
          </div>

          {/* South Stand */}
          <div
            style={{ position: 'absolute', bottom: '10%', left: '30%', width: '40%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'south-stand')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}
            aria-label={`South Stand: ${getDensityLabel(zones.find(z => z.id === 'south-stand')?.density)}`}
          >
            South Stand
          </div>

          {/* Gate A */}
          <div
            style={{ position: 'absolute', top: '40%', left: '10%', width: '20%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'gate-a')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}
            aria-label={`Gate A: ${getDensityLabel(zones.find(z => z.id === 'gate-a')?.density)}`}
          >
            Gate A
          </div>

          {/* Gate B */}
          <div
            style={{ position: 'absolute', top: '40%', right: '10%', width: '20%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'gate-b')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}
            aria-label={`Gate B: ${getDensityLabel(zones.find(z => z.id === 'gate-b')?.density)}`}
          >
            Gate B
          </div>

          {/* Center Field */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', top: '35%', left: '35%', width: '30%', height: '30%', border: '2px dashed var(--glass-border)', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Field
          </div>

          {/* Recommended Route */}
          {!isEmergency && leastCrowdedGate && (
            <svg
              aria-hidden="true"
              focusable="false"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <path
                d={leastCrowdedGate.id === 'gate-a' ? "M 80 150 Q 150 150 200 80" : "M 250 150 Q 200 150 150 250"}
                stroke="var(--primary)" strokeWidth="4" strokeDasharray="8 8" fill="none" className="pulse"
              />
            </svg>
          )}

          {/* Emergency Arrows */}
          {isEmergency && (
            <svg
              aria-hidden="true"
              focusable="false"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <path d="M 150 80 L 150 20" stroke="red" strokeWidth="6" fill="none" markerEnd="url(#arrow)" />
              <path d="M 150 250 L 150 290" stroke="red" strokeWidth="6" fill="none" markerEnd="url(#arrow)" />
            </svg>
          )}
        </div>
      </div>

      <div className="glass-panel text-center">
        {isEmergency ? (
          <p role="alert" aria-live="assertive" style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1rem' }}>
            Proceed to the nearest glowing exit immediately. Do not use elevators.
          </p>
        ) : (
          <p aria-live="polite">
            Smart Route active. Use{' '}
            <strong style={{ color: 'var(--primary)' }}>{leastCrowdedGate?.name}</strong>{' '}
            for fastest entry to your section across the North Stand.
          </p>
        )}
      </div>

      {/* Screen-reader accessible zone summary */}
      <section aria-label="Zone density summary" className="sr-only">
        {zones.map(z => (
          <p key={z.id}>{z.name}: {z.density}% capacity — {getDensityLabel(z.density)}</p>
        ))}
      </section>
    </section>
  );
};

export default Navigation;
