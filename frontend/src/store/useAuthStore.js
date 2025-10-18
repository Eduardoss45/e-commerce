import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      verified: false,
      setAuth: (userData, token) =>
        set({
          user: userData,
          token,
          verified: userData?.verified || false,
        }),
      clearAuth: () => set({ user: null, token: null, verified: false }),
      markVerified: () => set(state => ({ ...state, verified: true })),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user ? { email: state.user.email, verified: state.user.verified } : null,
      }),
    }
  )
);
