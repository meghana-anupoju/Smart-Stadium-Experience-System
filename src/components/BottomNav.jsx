import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Coffee, ShieldAlert } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/nav" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Map size={24} />
        <span>Nav</span>
      </NavLink>
      <NavLink to="/food" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Coffee size={24} />
        <span>Food</span>
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ShieldAlert size={20} style={{ opacity: 0.5 }} />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
