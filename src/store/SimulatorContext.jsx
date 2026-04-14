import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulatorContext = createContext();

export const useSimulator = () => useContext(SimulatorContext);

const INITIAL_ZONES = [
  { id: 'gate-a', name: 'Gate A Entry', density: 30 },
  { id: 'gate-b', name: 'Gate B Entry', density: 85 },
  { id: 'north-stand', name: 'North Stand', density: 60 },
  { id: 'south-stand', name: 'South Stand', density: 45 },
];

const INITIAL_STALLS = [
  { id: 'stall-1', name: 'Burger & Brews', waitTime: 12 },
  { id: 'stall-2', name: 'Pizza Corner', waitTime: 25 },
  { id: 'stall-3', name: 'Snack Shack', waitTime: 5 },
];

const INITIAL_ALERTS = [
  { id: 1, text: 'Welcome to the match! Find your seat using the Navigation tab.', type: 'info' }
];

export const SimulatorProvider = ({ children }) => {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [stalls, setStalls] = useState(INITIAL_STALLS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isEmergency, setIsEmergency] = useState(false);

  // Background Simulator
  useEffect(() => {
    if (isEmergency) return; // Freeze simulator in emergency

    const intervalId = setInterval(() => {
      // Randomize crowd density
      setZones(prev => prev.map(zone => ({
        ...zone,
        density: Math.max(10, Math.min(100, zone.density + (Math.floor(Math.random() * 11) - 5))) // Fluctuate +/- 5%
      })));

      // Randomize wait times
      setStalls(prev => prev.map(stall => ({
        ...stall,
        waitTime: Math.max(2, Math.min(45, stall.waitTime + (Math.floor(Math.random() * 5) - 2))) // Fluctuate +/- 2 mins
      })));

    }, 3000);

    return () => clearInterval(intervalId);
  }, [isEmergency]);

  // Derived state: smart routing based on density
  useEffect(() => {
    const gateB = zones.find(z => z.id === 'gate-b');
    if (gateB && gateB.density > 90) {
      if (!alerts.find(a => a.id === 'gate-alert')) {
         pushAlert('Gate B is heavily congested. Please consider using Gate A.', 'warning', 'gate-alert');
      }
    }
  }, [zones]);

  const pushAlert = (text, type = 'info', id = Date.now().toString()) => {
    setAlerts(prev => [{ id, text, type }, ...prev]);
  };

  const triggerEmergency = () => {
    setIsEmergency(true);
    pushAlert('EMERGENCY EVACUATION: Please follow the flashing paths to the nearest exit immediately.', 'danger', 'emergency-alert');
  };

  const clearEmergency = () => {
    setIsEmergency(false);
    setAlerts(prev => prev.filter(a => a.id !== 'emergency-alert'));
    pushAlert('Emergency resolved. Returning to normal operations.', 'success');
  };

  return (
    <SimulatorContext.Provider value={{
      zones, stalls, alerts, isEmergency,
      pushAlert, triggerEmergency, clearEmergency
    }}>
      {children}
    </SimulatorContext.Provider>
  );
};
