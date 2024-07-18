import { create } from 'zustand';
import { NavToggleState, User, UserState, TagState } from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  addTag: (content: string) =>
    set((state) => ({
      tags: [...state.tags, { id: Date.now(), content }],
    })),
  removeTag: (id: number) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    })),
}));
