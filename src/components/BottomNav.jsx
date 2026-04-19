import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Coffee, ShieldAlert } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink
        to="/"
        end
        id="nav-home"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Home"
      >
        <Home size={24} aria-hidden="true" />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/nav"
        id="nav-map"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Navigation map"
      >
        <Map size={24} aria-hidden="true" />
        <span>Nav</span>
      </NavLink>
      <NavLink
        to="/food"
        id="nav-food"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Food and facilities"
      >
        <Coffee size={24} aria-hidden="true" />
        <span>Food</span>
      </NavLink>
      <NavLink
        to="/admin"
        id="nav-admin"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Admin command center"
      >
        <ShieldAlert size={20} aria-hidden="true" style={{ opacity: 0.5 }} />
        <span className="sr-only">Admin</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
