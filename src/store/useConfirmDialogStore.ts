import { create } from 'zustand';

type ConfirmDialogStore = {
  isOpen: boolean;
  resourceName: string;
  onConfirm: () => void;
  isLoading: boolean;
  openConfirm: (config: {
    onConfirm: () => void;
    resourceName?: string;
  }) => void;
  closeConfirm: () => void;
  setLoading: (loading: boolean) => void;
};

export const useConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  resourceName: '',
  isLoading: false,
  onConfirm: () => {},
  openConfirm: ({ onConfirm, resourceName }) =>
    set({
      resourceName: resourceName || 'data',
      isOpen: true,
      onConfirm,
    }),
  closeConfirm: () => set({ isOpen: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
