import { create } from 'zustand';
import type { IUser } from '@shared/types';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
