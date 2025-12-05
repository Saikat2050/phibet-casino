import { create } from 'zustand';

export const useProtectAuth = create((set) => ({
  authData: null,
  isAuthorized: false,
  setAuthData: (authData) => set({ authData, isAuthorized: true }),
  clearAuthData: () => set({ authData: null, isAuthorized: false }),
}));
