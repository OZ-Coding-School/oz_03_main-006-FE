import { create } from 'zustand';
import { AlertState, NavToggleState, User, UserState } from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useAlertStore = create<AlertState>((set) => ({
  showAlert: false,
  alertMessage: '',
  setAlert: (message) =>
    set(() => ({
      showAlert: true,
      alertMessage: message,
    })),
  clearAlert: () =>
    set(() => ({
      showAlert: false,
      alertMessage: '',
    })),
}));
