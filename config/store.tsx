import { create } from 'zustand';
import { NavToggleState, User, UserState } from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));

