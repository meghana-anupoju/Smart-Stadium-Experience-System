import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock firebase before importing anything that uses it
vi.mock('../firebase.js', () => ({
  logSimulatedEvent: vi.fn(),
  saveSimulatedData: vi.fn(),
  default: {},
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

  it('renders admin gate when not authorized at /admin route', async () => {
    // Clear any leftover session auth
    sessionStorage.removeItem('adminAuthorized');
    renderApp('/admin');
    expect(await screen.findByText(/Access Restricted/i)).toBeTruthy();
  });

  it('shows BottomNav on non-admin pages', async () => {
    renderApp('/');
    const nav = await screen.findByRole('navigation');
    expect(nav).toBeTruthy();
  });
});
