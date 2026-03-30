import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../store/onboardingStore';
import { useLanguage } from '../contexts/LanguageContext';
import Step1PersonalInfo from '../components/steps/Step1PersonalInfo';
import Step2Financials from '../components/steps/Step2Financials';
import Step2DocumentUpload from '../components/steps/Step2DocumentUpload';
import Step2VideoVerification from '../components/steps/Step2VideoVerification';
import Step3Processing from '../components/steps/Step3Processing';
import Step4Decision from '../components/steps/Step4Decision';
import { CheckCircle, User, FileText, Cpu, Award, Briefcase, Video } from 'lucide-react';
export default function Onboarding() {
    const { step } = useOnboardingStore();
    const { t } = useLanguage();
    const STEPS = [
        { label: t('onboarding.steps.identity'), Icon: User },
        { label: t('onboarding.steps.financials'), Icon: Briefcase },
        { label: t('onboarding.steps.document'), Icon: FileText },
        { label: t('onboarding.steps.video'), Icon: Video },
        { label: t('onboarding.steps.processing'), Icon: Cpu },
        { label: t('onboarding.steps.decision'), Icon: Award },
    ];
    return (_jsxs("div", { className: "page", style: { padding: '80px 24px 60px', maxWidth: 760, margin: '0 auto' }, children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, style: { textAlign: 'center', marginBottom: 40 }, children: [_jsx("h1", { style: { fontSize: 32, fontWeight: 700, marginBottom: 8 }, children: t('onboarding.title') }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 15 }, children: t('onboarding.subtitle') })] }), _jsx("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 48 }, children: STEPS.map((s, i) => {
                    const stepNum = i + 1;
                    const isCompleted = step > stepNum;
                    const isActive = step === stepNum;
                    return (_jsxs(React.Fragment, { children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }, children: [_jsx("div", { className: `step-dot ${isCompleted ? 'completed' : isActive ? 'active' : 'pending'}`, children: isCompleted ? _jsx(CheckCircle, { size: 14 }) : _jsx("span", { children: stepNum }) }), _jsx("span", { style: { fontSize: 11, fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }, children: s.label })] }), i < STEPS.length - 1 && (_jsxs("div", { style: { flex: 1, position: 'relative', margin: '0 8px', height: 28, top: -10 }, children: [_jsx("div", { className: "step-line" }), _jsx("div", { className: "step-line-fill", style: { width: isCompleted ? '100%' : '0%' } })] }))] }, s.label));
                }) }), _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.3 }, children: [step === 1 && _jsx(Step1PersonalInfo, {}), step === 2 && _jsx(Step2Financials, {}), step === 3 && _jsx(Step2DocumentUpload, {}), step === 4 && _jsx(Step2VideoVerification, {}), step === 5 && _jsx(Step3Processing, {}), step === 6 && _jsx(Step4Decision, {})] }, step) })] }));
}
