import { create } from 'zustand';

export interface ProductFormUIState {
  productId: string | null;
  isSuccessOpen: boolean;
  successMessage: string;

  setProductId: (productId: string | null) => void;
  showSuccess: (message: string) => void;
  closeSuccess: () => void;
  reset: () => void;
}

export const useProductFormStore = create<ProductFormUIState>((set) => ({
  productId: null,
  isSuccessOpen: false,
  successMessage: '',

  setProductId: (productId) => set({ productId }),
  showSuccess: (successMessage) => set({ successMessage, isSuccessOpen: true }),
  closeSuccess: () => set({ successMessage: '', isSuccessOpen: false }),
  reset: () => set({ productId: null, isSuccessOpen: false, successMessage: '' }),
}));

