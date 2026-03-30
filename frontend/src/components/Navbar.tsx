import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { pathname } = useLocation();
  const { token, logout } = useAuthStore();
  const { t } = useLanguage();

  const publicLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/onboarding', label: t('nav.onboarding') },
  ];

  const adminLinks = [
    { to: '/reviewer', label: t('nav.reviewer') },
    { to: '/admin', label: t('nav.admin') },
    { to: '/profile', label: t('nav.profile') },
  ];

  const links = token ? [...publicLinks, ...adminLinks] : publicLinks;

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
        <LanguageSelector />
        {!token ? (
          <>
            <Link to="/login" className="navbar-link" style={{ marginRight: 8 }}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13, background: 'var(--gradient-primary)', color: 'var(--text-primary)', border: 'none' }}>
              {t('nav.register')}
            </Link>
          </>
        ) : (
          <button onClick={logout} className="navbar-link" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
