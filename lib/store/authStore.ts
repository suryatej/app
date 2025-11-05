// Authentication Store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session, AuthMode, AuthError } from '@/types/auth.types';

interface AuthState {
  // State
  authMode: AuthMode;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;

  // Actions
  setAuthMode: (mode: AuthMode) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  login: (user: User, session: Session) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  authMode: 'signin' as AuthMode,
  user: null,
  session: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuthMode: (mode) => set({ authMode: mode }),
      
      setUser: (user) => set({ user }),
      
      setSession: (session) => set({ session }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      login: (user, session) => set({ 
        user, 
        session, 
        isLoading: false, 
        error: null 
      }),
      
      logout: () => set({ 
        user: null, 
        session: null, 
        error: null 
      }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        authMode: state.authMode,
      }),
    }
  )
);
