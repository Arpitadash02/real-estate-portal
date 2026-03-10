import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const brokerLinks = [
    { to: '/broker/dashboard', label: '🏠 My Listings' },
    { to: '/broker/requests', label: '📋 Booking Requests' },
  ];

  const customerLinks = [
    { to: '/customer/properties', label: '🔍 Browse Properties' },
    { to: '/customer/dashboard', label: '📁 My Bookings' },
  ];

  const links = user?.role === 'broker' ? brokerLinks : customerLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-logo">⬡</span>
          <span className="navbar-name">
            Luxe<span className="navbar-name-accent">Estate</span>
          </span>
        </div>

        <div className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar-link${isActive ? ' active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-right">
          <div className="navbar-user">
            <div className="navbar-avatar">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name}</span>
              <span className="navbar-user-role">{user?.role}</span>
            </div>
          </div>
          <button className="navbar-logout btn btn-secondary btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
