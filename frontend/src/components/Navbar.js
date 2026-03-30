import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
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
    return (_jsxs("nav", { className: "navbar", children: [_jsxs(Link, { to: "/", className: "navbar-logo", children: [_jsx(Shield, { size: 22 }), "OnboardAI"] }), _jsxs("div", { className: "navbar-links", children: [links.map((l) => (_jsx(Link, { to: l.to, className: `navbar-link${pathname === l.to ? ' active' : ''}`, children: l.label }, l.to))), _jsx(LanguageSelector, {}), !token ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "navbar-link", style: { marginRight: 8 }, children: t('nav.login') }), _jsx(Link, { to: "/register", className: "btn-primary", style: { padding: '8px 20px', fontSize: 13, background: 'var(--gradient-primary)', color: 'var(--text-primary)', border: 'none' }, children: t('nav.register') })] })) : (_jsxs("button", { onClick: logout, className: "navbar-link", style: { background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx(LogOut, { size: 16 }), " Logout"] }))] })] }));
}
