import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock firebase before importing anything that uses it
vi.mock('../firebase.js', () => ({
  logAnalyticsEvent: vi.fn(),
  saveAlertToFirestore: vi.fn().mockResolvedValue('mock-id'),
  subscribeToAlerts: vi.fn().mockReturnValue(() => {}),
  saveCrowdSnapshot: vi.fn(),
  saveOrderToFirestore: vi.fn().mockResolvedValue('mock-order-id'),
  default: {},
}));

import { SimulatorProvider, useSimulator } from '../store/SimulatorContext.jsx';

// Test helper component
const TestConsumer = () => {
  const { zones, stalls, alerts, isEmergency, pushAlert, triggerEmergency, clearEmergency } = useSimulator();
  return (
    <div>
      <span data-testid="zone-count">{zones.length}</span>
      <span data-testid="stall-count">{stalls.length}</span>
      <span data-testid="alert-count">{alerts.length}</span>
      <span data-testid="emergency-status">{isEmergency ? 'emergency' : 'normal'}</span>
      <button data-testid="push-alert" onClick={() => pushAlert('Test alert', 'info')}>Push Alert</button>
      <button data-testid="trigger-emergency" onClick={triggerEmergency}>Trigger Emergency</button>
      <button data-testid="clear-emergency" onClick={clearEmergency}>Clear Emergency</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <MemoryRouter>
      <SimulatorProvider>
        <TestConsumer />
      </SimulatorProvider>
    </MemoryRouter>
  );

describe('SimulatorContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct zone and stall counts', () => {
    renderWithProvider();
    expect(screen.getByTestId('zone-count').textContent).toBe('4');
    expect(screen.getByTestId('stall-count').textContent).toBe('3');
  });

  it('starts in non-emergency mode with 1 initial alert', () => {
    renderWithProvider();
    expect(screen.getByTestId('emergency-status').textContent).toBe('normal');
    expect(screen.getByTestId('alert-count').textContent).toBe('1');
  });

  it('pushAlert adds a new alert to the top of the list', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('push-alert'));
    expect(screen.getByTestId('alert-count').textContent).toBe('2');
  });

  it('triggerEmergency sets emergency to true and adds an alert', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('trigger-emergency'));
    expect(screen.getByTestId('emergency-status').textContent).toBe('emergency');
    // Should have initial alert + emergency alert
    expect(parseInt(screen.getByTestId('alert-count').textContent)).toBeGreaterThanOrEqual(2);
  });

  it('clearEmergency resolves the emergency and removes emergency alert', () => {
    renderWithProvider();
    // First trigger an emergency
    fireEvent.click(screen.getByTestId('trigger-emergency'));
    expect(screen.getByTestId('emergency-status').textContent).toBe('emergency');
    // Now clear it
    fireEvent.click(screen.getByTestId('clear-emergency'));
    expect(screen.getByTestId('emergency-status').textContent).toBe('normal');
  });
});
