
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

  return (
    <div className="page" style={{ padding: '80px 24px 60px', maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          {t('onboarding.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {t('onboarding.subtitle')}
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
                <div className={`step-dot ${isCompleted ? 'completed' : isActive ? 'active' : 'pending'}`}>
                  {isCompleted ? <CheckCircle size={14} /> : <span>{stepNum}</span>}
                </div>
                <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, position: 'relative', margin: '0 8px', height: 28, top: -10 }}>
                  <div className="step-line" />
                  <div className="step-line-fill" style={{ width: isCompleted ? '100%' : '0%' }} />
                </div>
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
          {step === 2 && <Step2Financials />}
          {step === 3 && <Step2DocumentUpload />}
          {step === 4 && <Step2VideoVerification />}
          {step === 5 && <Step3Processing />}
          {step === 6 && <Step4Decision />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
