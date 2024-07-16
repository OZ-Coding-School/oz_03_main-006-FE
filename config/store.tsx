import { create } from 'zustand';
import {  NavToggleState, } from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: true,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

