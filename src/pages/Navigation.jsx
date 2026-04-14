import React from 'react';
import { useSimulator } from '../store/SimulatorContext.jsx';

const Navigation = () => {
  const { zones, isEmergency } = useSimulator();

  // Highlight optimal entry
  const leastCrowdedGate = zones.filter(z => z.id.includes('gate')).sort((a, b) => a.density - b.density)[0];

  const getDensityColor = (density) => {
    if (density < 50) return 'var(--success)';
    if (density < 80) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="flex-col gap-4" style={{ height: '100%' }}>
      <div className="flex-row justify-between">
        <h2>Live Map</h2>
        {isEmergency && <span className="badge badge-danger pulse">EVACUATION</span>}
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div style={{ position: 'relative', width: '100%', height: '300px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Mock Map Layout */}
          <div style={{ position: 'absolute', top: '10%', left: '30%', width: '40%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'north-stand')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>North Stand</div>
          
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '40%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'south-stand')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>South Stand</div>

          <div style={{ position: 'absolute', top: '40%', left: '10%', width: '20%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'gate-a')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>Gate A</div>
          
          <div style={{ position: 'absolute', top: '40%', right: '10%', width: '20%', height: '20%', background: getDensityColor(zones.find(z => z.id === 'gate-b')?.density), opacity: 0.8, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>Gate B</div>

          {/* Center Field */}
          <div style={{ position: 'absolute', top: '35%', left: '35%', width: '30%', height: '30%', border: '2px dashed var(--glass-border)', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Field</div>

          {/* Recommended Route Overlay */}
          {!isEmergency && leastCrowdedGate && (
             <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d={leastCrowdedGate.id === 'gate-a' ? "M 80 150 Q 150 150 200 80" : "M 250 150 Q 200 150 150 250"} 
                      stroke="var(--primary)" strokeWidth="4" strokeDasharray="8 8" fill="none" className="pulse" />
             </svg>
          )}

          {isEmergency && (
             <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
               <path d="M 150 80 L 150 20" stroke="red" strokeWidth="6" fill="none" markerEnd="url(#arrow)" />
               <path d="M 150 250 L 150 290" stroke="red" strokeWidth="6" fill="none" markerEnd="url(#arrow)" />
             </svg>
          )}
        </div>
      </div>

      <div className="glass-panel text-center">
        {isEmergency ? (
          <p className="title-gradient" style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Proceed to the nearest glowing exit immediately. Do not use elevators.</p>
        ) : (
          <p>Smart Route active. Use <strong style={{ color: 'var(--primary)' }}>{leastCrowdedGate?.name}</strong> for fastest entry to your section across the North Stand.</p>
        )}
      </div>

    </div>
  );
};

export default Navigation;
