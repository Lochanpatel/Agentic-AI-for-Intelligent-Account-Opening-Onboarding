import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, UserPlus, User } from 'lucide-react';
import { registerUser } from '../api/client';
export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('reviewer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await registerUser({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                role
            });
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        }
        catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "page", style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }, children: [_jsx("div", { className: "glow-orb", style: { top: '20%', left: '30%', background: 'var(--accent-blue)', opacity: 0.15 } }), _jsx("div", { className: "glow-orb", style: { bottom: '20%', right: '30%', background: 'var(--accent-purple)', opacity: 0.15 } }), _jsxs(motion.div, { className: "glass-card", style: { width: '100%', maxWidth: 460, padding: '48px 40px', position: 'relative', zIndex: 10 }, initial: { opacity: 0, y: 30, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.5, ease: 'easeOut' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 40 }, children: [_jsx("div", { style: {
                                    width: 48, height: 48, borderRadius: 12, background: 'var(--bg-primary)',
                                    border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }, children: _jsx(UserPlus, { size: 24, color: "var(--text-primary)" }) }), _jsx("h1", { style: { fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }, children: "Create Account" }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-secondary)' }, children: "Sign up for an administrative or user role" })] }), _jsxs("form", { onSubmit: handleRegister, style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [error && (_jsx("div", { style: { padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: 13, color: 'var(--accent-red)' }, children: error })), success && (_jsx("div", { style: { padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 8, fontSize: 13, color: 'var(--accent-green)' }, children: success })), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "First Name" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(User, { size: 16, color: "var(--text-muted)", style: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "text", className: "form-input", placeholder: "Lochan", value: firstName, onChange: (e) => setFirstName(e.target.value), required: true, style: { paddingLeft: 42 } })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Last Name" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(User, { size: 16, color: "var(--text-muted)", style: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "text", className: "form-input", placeholder: "Patel", value: lastName, onChange: (e) => setLastName(e.target.value), required: true, style: { paddingLeft: 42 } })] })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email Address" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Mail, { size: 16, color: "var(--text-muted)", style: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "email", className: "form-input", placeholder: "admin@board.ai", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: { paddingLeft: 42 } })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 16, color: "var(--text-muted)", style: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "password", className: "form-input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: { paddingLeft: 42 }, minLength: 8 })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Requested Role" }), _jsxs("select", { className: "form-input", value: role, onChange: (e) => setRole(e.target.value), style: { appearance: 'none', cursor: 'pointer' }, children: [_jsx("option", { value: "user", children: "User (Applicant)" }), _jsx("option", { value: "reviewer", children: "Reviewer" }), _jsx("option", { value: "admin", children: "Administrator" })] })] }), _jsx("button", { type: "submit", className: "btn-primary", disabled: loading || !!success, style: {
                                    marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    height: 44, fontSize: 15, fontWeight: 600
                                }, children: loading ? _jsx("div", { className: "spinner", style: { width: 18, height: 18 } }) : (_jsxs(_Fragment, { children: ["Create Account ", _jsx(ArrowRight, { size: 16 })] })) }), _jsxs("div", { style: { textAlign: 'center', marginTop: 16 }, children: [_jsx("span", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: "Already have an account? " }), _jsx(Link, { to: "/login", style: { color: 'var(--accent-blue)', fontWeight: 500, fontSize: 14, textDecoration: 'none' }, children: "Sign In here" })] })] })] })] }));
}
