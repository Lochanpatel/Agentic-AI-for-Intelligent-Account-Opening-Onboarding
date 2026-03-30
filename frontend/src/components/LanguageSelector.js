import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
export default function LanguageSelector() {
    const { language, setLanguage, availableLanguages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const currentLanguage = availableLanguages.find(lang => lang.code === language);
    return (_jsxs("div", { style: { position: 'relative' }, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "btn-ghost", style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    fontSize: 14,
                    minWidth: 120,
                    justifyContent: 'space-between'
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: { fontSize: 16 }, children: currentLanguage?.flag }), _jsx("span", { children: currentLanguage?.name })] }), _jsx(ChevronDown, { size: 14, style: {
                            transition: 'transform 0.2s',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        } })] }), _jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: { duration: 0.2 }, className: "glass-card", style: {
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 8,
                        minWidth: 180,
                        maxHeight: 300,
                        overflowY: 'auto',
                        zIndex: 1000,
                        padding: 8
                    }, children: availableLanguages.map((lang) => (_jsxs("button", { onClick: () => {
                            setLanguage(lang.code);
                            setIsOpen(false);
                        }, className: "btn-ghost", style: {
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
                        }, children: [_jsx("span", { style: { fontSize: 16 }, children: lang.flag }), _jsx("span", { style: { flex: 1, textAlign: 'left' }, children: lang.name }), language === lang.code && (_jsx("div", { style: {
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--accent-blue)'
                                } }))] }, lang.code))) })) }), isOpen && (_jsx("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                }, onClick: () => setIsOpen(false) }))] }));
}
