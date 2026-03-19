
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../store/onboardingStore';
import Step1PersonalInfo from '../components/steps/Step1PersonalInfo';
import Step2DocumentUpload from '../components/steps/Step2DocumentUpload';
import Step3Processing from '../components/steps/Step3Processing';
import Step4Decision from '../components/steps/Step4Decision';
import { CheckCircle, User, FileText, Cpu, Award } from 'lucide-react';


const STEPS = [
  { label: 'Personal Info', Icon: User },
  { label: 'Document', Icon: FileText },
  { label: 'Processing', Icon: Cpu },
  { label: 'Decision', Icon: Award },
];

export default function Onboarding() {
  const { step } = useOnboardingStore();

  return (
    <div className="page" style={{ padding: '80px 24px 60px', maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Open Your <span className="gradient-text">Account</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Complete in under 3 minutes — AI-powered verification
        </p>
      </motion.div>

      {/* Step Progress */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48 }}>
        {STEPS.map((s, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          return (
            <React.Fragment key={s.label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div className={`step-dot ${isCompleted ? 'completed' : isActive ? 'active' : 'pending'}`}>
                  {isCompleted ? <CheckCircle size={14} /> : <span>{stepNum}</span>}
                </div>
                <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-line ${isCompleted ? 'completed' : ''}`} style={{ margin: '0 8px', marginBottom: 20 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && <Step1PersonalInfo />}
          {step === 2 && <Step2DocumentUpload />}
          {step === 3 && <Step3Processing />}
          {step === 4 && <Step4Decision />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
