import { create } from 'zustand';

export interface RecipeFormState {
  isSuccessOpen: boolean;
  successMessage: string;
  showSuccess: (message: string) => void;
  closeSuccessDialog: () => void;
  resetUIState: () => void;
}

export const useRecipeFormStore = create<RecipeFormState>((set) => ({
  isSuccessOpen: false,
  successMessage: '',
  showSuccess: (successMessage) => set({ isSuccessOpen: true, successMessage }),
  closeSuccessDialog: () => set({ isSuccessOpen: false, successMessage: '' }),
  resetUIState: () => set({ isSuccessOpen: false, successMessage: '' }),
}));

