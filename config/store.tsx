import { create } from 'zustand';
import { NavToggleState } from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
