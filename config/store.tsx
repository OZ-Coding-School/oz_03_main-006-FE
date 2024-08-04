import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AlertState,
  NavToggleState,
  User,
  UserState,
  TagState,
  PromptState,
  LoadingAlertState,
  ConfirmAlertState,
} from './types';

export const useNavToggleStore = create<NavToggleState>((set) => ({
  isOpen: true,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      updateProfileImage: (imageUrl: string) =>
        set((state) => ({
          user: state.user ? { ...state.user, profile_image: imageUrl } : null,
        })),
    }),
    {
      name: 'userInfo',
    }
  )
);

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

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  addTag: (content: string, id?: number) =>
    set((state) => ({
      tags: [...state.tags, { tag_id: id ?? Math.random(), content }],
    })),
  removeTag: (id: number) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.tag_id !== id),
    })),
  clearTags: () => set({ tags: [] }),
}));

export const useConfirmAlertStore = create<ConfirmAlertState>((set) => ({
  showConfirmAlert: false,
  alertMessage: '',
  confirmResult: null,
  setConfirmAlert: (message) =>
    new Promise<boolean>((resolve) => {
      set(() => ({
        showConfirmAlert: true,
        alertMessage: message,
        confirmResult: (result: boolean) => {
          resolve(result),
            set({
              showConfirmAlert: false,
              alertMessage: '',
              confirmResult: null,
            });
        },
      }));
    }),
  clearConfirmAlert: () =>
    set(() => ({
      showConfirmAlert: false,
      alertMessage: '',
    })),
}));

export const usePromptStore = create<PromptState>((set) => ({
  showPrompt: false,
  promptMessage: '',
  confirmResult: null,
  setConfirmPrompt: (message) =>
    new Promise<string>((resolve) => {
      set(() => ({
        showPrompt: true,
        promptMessage: message,
        confirmResult: (result: string) => {
          resolve(result),
            set({ showPrompt: false, promptMessage: '', confirmResult: null });
        },
      }));
    }),
  clearPrompt: () =>
    set(() => ({
      showPrompt: false,
      promptMessage: '',
    })),
}));

export const useLoadingAlertStore = create<LoadingAlertState>((set) => ({
  showLoadingAlert: false,
  alertMessage: '',
  setLoadingAlert: (message) =>
    set(() => ({
      showLoadingAlert: true,
      alertMessage: message,
    })),
  clearLoadingAlert: () =>
    set(() => ({
      showLoadingAlert: false,
      alertMessage: '',
    })),
}));
