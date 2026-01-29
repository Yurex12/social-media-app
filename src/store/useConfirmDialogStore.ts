// hooks/use-confirm-store.ts
import { create } from 'zustand';

type ConfirmDialogStore = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading: boolean;
  openConfirm: (config: {
    title?: string;
    description?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirm: () => void;
  setLoading: (loading: boolean) => void;
};

export const useConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  isLoading: false,
  onConfirm: () => {},
  openConfirm: ({ title, description, onConfirm }) =>
    set({
      isOpen: true,
      title: title || 'Are you absolutely sure?',
      description: description || 'This action cannot be undone.',
      onConfirm,
    }),
  closeConfirm: () => set({ isOpen: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
