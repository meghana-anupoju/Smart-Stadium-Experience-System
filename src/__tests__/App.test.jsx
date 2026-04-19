import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

// Mock AuthContext so ProtectedRoute doesn't need real Firebase Auth
vi.mock('../store/AuthContext.jsx', () => ({
  useAuth: () => ({ user: null, authLoading: false, isAdmin: false, authError: '' }),
  AuthProvider: ({ children }) => children,
}));

import App from '../App.jsx';
import { SimulatorProvider } from '../store/SimulatorContext.jsx';

const renderApp = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </MemoryRouter>
  );

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Home page at / route', async () => {
    renderApp('/');
    expect(await screen.findByText(/Stadium Pass/i)).toBeTruthy();
  });

  it('renders Food page at /food route', async () => {
    renderApp('/food');
    expect(await screen.findByText(/Food & Facilities/i)).toBeTruthy();
  });

  it('renders Navigation page at /nav route', async () => {
    renderApp('/nav');
    expect(await screen.findByText(/Live Map/i)).toBeTruthy();
  });

  it('renders admin login page when not authenticated at /admin route', async () => {
    // AuthContext is mocked to return isAdmin: false
    renderApp('/admin');
    expect(await screen.findByText(/Admin Login/i)).toBeTruthy();
  });

  it('shows BottomNav on non-admin pages', async () => {
    renderApp('/');
    const nav = await screen.findByRole('navigation');
    expect(nav).toBeTruthy();
  });
});
