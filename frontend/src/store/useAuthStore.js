// store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      verified: false,

      setAuth: userData =>
        set({
          user: userData,
          verified: userData?.verified || false,
        }),

      clearAuth: () => set({ user: null, verified: false }),

      markVerified: () => set(state => ({ ...state, verified: true })),

      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user
          ? { _id: state.user._id, email: state.user.email, verified: state.user.verified }
          : null,
      }),
    }
  )
);
