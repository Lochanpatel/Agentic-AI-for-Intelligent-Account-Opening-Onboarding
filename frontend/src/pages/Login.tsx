import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginAdmin } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const res = await loginAdmin(formData);
      setAuth(res.data.access_token, res.data.role);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
      `
    }}>
      
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Main glass card */}
        <div style={{
          background: 'var(--glass-border)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: 24,
          padding: '48px 40px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 0 0 1px rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}>
          
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)',
          }} />
          
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {/* Logo with glow effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: -2,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: 20,
                filter: 'blur(8px)',
                opacity: 0.6,
                zIndex: -1,
              }} />
              <ShieldCheck size={28} color="var(--text-primary)" style={{ position: 'relative', zIndex: 1 }} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 8,
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
                Welcome Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                marginBottom: 32,
                fontWeight: 400,
                margin: 0,
              }}
            >
              Sign in to your administrative dashboard
            </motion.p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: '16px 20px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 12,
                    fontSize: 14,
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                display: 'block',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@board.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  required
                  style={{
                    width: '100%',
                    height: 52,
                    paddingLeft: 48,
                    paddingRight: 16,
                    fontSize: 15,
                    background: isFocused === 'email' 
                      ? 'rgba(99, 102, 241, 0.08)' 
                      : 'var(--glass-border)',
                    border: isFocused === 'email'
                      ? '1px solid rgba(99, 102, 241, 0.4)'
                      : 'var(--glass-border)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                  }}
                />
                {isFocused === 'email' && (
                  <div style={{
                    position: 'absolute',
                    inset: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 11,
                    pointerEvents: 'none',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                  }} />
                )}
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                display: 'block',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  required
                  style={{
                    width: '100%',
                    height: 52,
                    paddingLeft: 48,
                    paddingRight: 48,
                    fontSize: 15,
                    background: isFocused === 'password'
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'var(--glass-border)',
                    border: isFocused === 'password'
                      ? '1px solid rgba(99, 102, 241, 0.4)'
                      : 'var(--glass-border)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {isFocused === 'password' && (
                  <div style={{
                    position: 'absolute',
                    inset: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 11,
                    pointerEvents: 'none',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                  }} />
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 52,
                  background: loading
                    ? 'var(--glass-border)'
                    : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  color: loading ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Button shimmer effect */}
                {!loading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
                    animation: 'shimmer 2s infinite',
                  }} />
                )}
                
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 20,
                      height: 20,
                      border: '2px solid var(--text-primary)',
                      borderTop: '2px solid transparent',
                      borderRight: '2px solid transparent',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} style={{ transition: 'transform 0.3s ease' }} />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Add global styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .form-input::placeholder {
          color: var(--text-muted);
        }
        
        .form-input:focus::placeholder {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
