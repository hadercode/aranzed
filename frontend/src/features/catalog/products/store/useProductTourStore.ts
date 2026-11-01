import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductTourState {
  hasCompletedProductTour: boolean;
  isIntroModalOpen: boolean;
  shouldAutoStartTour: boolean;
  openIntroModal: () => void;
  closeIntroModal: () => void;
  completeTour: () => void;
  resetTour: () => void;
  setShouldAutoStartTour: (val: boolean) => void;
}

export const useProductTourStore = create<ProductTourState>()(
  persist(
    (set) => ({
      hasCompletedProductTour: false,
      isIntroModalOpen: false,
      shouldAutoStartTour: false,
      openIntroModal: () => set({ isIntroModalOpen: true }),
      closeIntroModal: () => set({ isIntroModalOpen: false }),
      completeTour: () =>
        set({
          hasCompletedProductTour: true,
          isIntroModalOpen: false,
          shouldAutoStartTour: false,
        }),
      resetTour: () =>
        set({
          hasCompletedProductTour: false,
          isIntroModalOpen: true,
          shouldAutoStartTour: false,
        }),
      setShouldAutoStartTour: (val) => set({ shouldAutoStartTour: val }),
    }),
    {
      name: 'ministore-product-tour-storage',
    }
  )
);

