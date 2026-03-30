import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 12px',
          fontSize: 14,
          minWidth: 120,
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.name}</span>
        </div>
        <ChevronDown size={14} style={{ 
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card"
            style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: 8,
              minWidth: 180,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 1000,
              padding: 8
            }}
          >
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className="btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 12px',
                  justifyContent: 'flex-start',
                  background: language === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: language === lang.code ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  borderRadius: 6,
                  fontSize: 14
                }}
              >
                <span style={{ fontSize: 16 }}>{lang.flag}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
                {language === lang.code && (
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    background: 'var(--accent-blue)' 
                  }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close overlay when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
