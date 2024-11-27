import { IAuthStateProps } from '@/interfaces/IAuth';
import { create } from 'zustand';

import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create<IAuthStateProps>()(
  persist(
    (set) => ({
      user: undefined,
      isAuthenticated: false,
      signedOut: false,
      signIn: (userData) =>
        set({ user: userData, isAuthenticated: true, signedOut: false }),
      signOut: () =>
        set({ user: undefined, isAuthenticated: false, signedOut: true }),
      getSelf: async () => {
        const res = await fetch(`/api/user/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          set({ user: data, isAuthenticated: true, signedOut: false });
          return data;
        }
        return null;
      },
    }),
    {
      name: 'auth-indicator', // Name of the storage item
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Only store non-sensitive data
      storage: createJSONStorage(() => localStorage),
    }
  )
);
