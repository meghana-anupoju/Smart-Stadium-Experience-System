import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  logAnalyticsEvent,
  saveAlertToFirestore,
  subscribeToAlerts,
  saveCrowdSnapshot,
} from '../firebase.js';

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

const SEED_ALERT = {
  id: 'seed-1',
  text: 'Welcome to the match! Find your seat using the Navigation tab.',
  type: 'info',
};

export const SimulatorProvider = ({ children }) => {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [stalls, setStalls] = useState(INITIAL_STALLS);
  const [alerts, setAlerts] = useState([SEED_ALERT]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [firestoreAlerts, setFirestoreAlerts] = useState([]);

  // Subscribe to Firestore alerts (real-time)
  useEffect(() => {
    const unsubscribe = subscribeToAlerts((docs) => {
      setFirestoreAlerts(docs);
    });
    return () => unsubscribe();
  }, []);

  // Background Simulator — crowd density + wait times
  useEffect(() => {
    if (isEmergency) return;

    const intervalId = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        density: Math.max(10, Math.min(100, zone.density + (Math.floor(Math.random() * 11) - 5))),
      })));

      setStalls(prev => prev.map(stall => ({
        ...stall,
        waitTime: Math.max(2, Math.min(45, stall.waitTime + (Math.floor(Math.random() * 5) - 2))),
      })));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isEmergency]);

  // Persist crowd snapshots to Firestore every 15 seconds
  useEffect(() => {
    if (isEmergency) return;
    const snapshotInterval = setInterval(() => {
      saveCrowdSnapshot(zones);
    }, 15000);
    return () => clearInterval(snapshotInterval);
  }, [zones, isEmergency]);

  // Auto-alert if Gate B gets very congested
  useEffect(() => {
    const gateB = zones.find(z => z.id === 'gate-b');
    if (gateB && gateB.density > 90) {
      if (!alerts.find(a => a.id === 'gate-alert')) {
        pushAlert('Gate B is heavily congested. Please consider using Gate A.', 'warning', 'gate-alert');
      }
    }
  }, [zones]);

  const pushAlert = useCallback(async (text, type = 'info', id = Date.now().toString()) => {
    setAlerts(prev => [{ id, text, type }, ...prev]);
    logAnalyticsEvent('alert_pushed', { type });
    await saveAlertToFirestore(text, type);
  }, []);

  const triggerEmergency = useCallback(() => {
    setIsEmergency(true);
    pushAlert('EMERGENCY EVACUATION: Please follow the flashing paths to the nearest exit immediately.', 'danger', 'emergency-alert');
    logAnalyticsEvent('emergency_triggered', { timestamp: new Date().toISOString() });
  }, [pushAlert]);

  const clearEmergency = useCallback(() => {
    setIsEmergency(false);
    setAlerts(prev => prev.filter(a => a.id !== 'emergency-alert'));
    pushAlert('Emergency resolved. Returning to normal operations.', 'success');
    logAnalyticsEvent('emergency_cleared', { timestamp: new Date().toISOString() });
  }, [pushAlert]);

  // Merge local + Firestore alerts (deduplicated)
  const mergedAlerts = useMemo(() => {
    const firestoreIds = new Set(firestoreAlerts.map(a => a.id));
    const localOnly = alerts.filter(a => !firestoreIds.has(a.id));
    return [...firestoreAlerts, ...localOnly].slice(0, 15);
  }, [alerts, firestoreAlerts]);

  const contextValue = useMemo(() => ({
    zones, stalls, alerts: mergedAlerts, isEmergency,
    pushAlert, triggerEmergency, clearEmergency,
  }), [zones, stalls, mergedAlerts, isEmergency, pushAlert, triggerEmergency, clearEmergency]);

  return (
    <SimulatorContext.Provider value={contextValue}>
      {children}
    </SimulatorContext.Provider>
  );
};
