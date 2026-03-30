import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    token: null,
    role: null,
    setAuth: (token, role) => set({ token, role }),
    logout: () => set({ token: null, role: null }),
}), { name: 'auth-storage' }));
