import { create } from 'zustand';

export interface SaleFormUIState {
  isSuccessOpen: boolean;
  successMessage: string;

  showSuccess: (message: string) => void;
  closeSuccess: () => void;
  reset: () => void;
}

export const useSaleFormStore = create<SaleFormUIState>((set) => ({
  isSuccessOpen: false,
  successMessage: '',

  showSuccess: (successMessage) => set({ successMessage, isSuccessOpen: true }),
  closeSuccess: () => set({ successMessage: '', isSuccessOpen: false }),
  reset: () => set({ isSuccessOpen: false, successMessage: '' }),
}));

