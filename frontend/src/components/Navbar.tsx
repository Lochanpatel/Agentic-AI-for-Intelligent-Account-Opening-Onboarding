import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/onboarding', label: 'Open Account' },
    { to: '/reviewer', label: 'Reviewer' },
    { to: '/admin', label: 'Admin' },
  ];
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <Shield size={22} />
        OnboardAI
      </Link>
      <div className="navbar-links">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`navbar-link${pathname === l.to ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
        <Link to="/onboarding" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
