import { create } from 'zustand';
import type { ApplicantInfo, OnboardingSession } from '../api/client';

interface OnboardingStore {
  // Current step (1–4)
  step: number;
  setStep: (s: number) => void;

  // Form data
  applicant: Partial<ApplicantInfo>;
  setApplicant: (data: Partial<ApplicantInfo>) => void;

  // Session
  sessionId: string | null;
  session: OnboardingSession | null;
  setSessionId: (id: string) => void;
  setSession: (s: OnboardingSession) => void;

  // Document
  uploadedFile: File | null;
  documentType: string;
  setUploadedFile: (f: File | null) => void;
  setDocumentType: (t: string) => void;

  // Reset
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  applicant: {},
  setApplicant: (data) => set((s) => ({ applicant: { ...s.applicant, ...data } })),

  sessionId: null,
  session: null,
  setSessionId: (sessionId) => set({ sessionId }),
  setSession: (session) => set({ session }),

  uploadedFile: null,
  documentType: 'PASSPORT',
  setUploadedFile: (uploadedFile) => set({ uploadedFile }),
  setDocumentType: (documentType) => set({ documentType }),

  reset: () => set({
    step: 1, applicant: {}, sessionId: null, session: null,
    uploadedFile: null, documentType: 'PASSPORT',
  }),
}));
