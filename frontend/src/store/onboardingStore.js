import { create } from 'zustand';
export const useOnboardingStore = create((set, get) => ({
    step: 1,
    setStep: (step) => set({ step }),
    nextStep: () => {
        const currentStep = get().step;
        const newStep = Math.min(currentStep + 1, 6);
        console.log('Moving to next step:', currentStep, '->', newStep);
        set({ step: newStep });
    },
    previousStep: () => {
        const currentStep = get().step;
        const newStep = Math.max(currentStep - 1, 1);
        console.log('Moving to previous step:', currentStep, '->', newStep);
        set({ step: newStep });
    },
    applicant: {},
    setApplicant: (data) => set((s) => ({ applicant: { ...s.applicant, ...data } })),
    updateData: (data) => set((state) => ({ applicant: { ...state.applicant, ...data } })),
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
