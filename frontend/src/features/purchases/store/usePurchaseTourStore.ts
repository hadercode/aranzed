import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PurchaseTourState {
  hasCompletedPurchaseTour: boolean;
  isIntroModalOpen: boolean;
  shouldAutoStartTour: boolean;
  openIntroModal: () => void;
  closeIntroModal: () => void;
  completeTour: () => void;
  resetTour: () => void;
  setShouldAutoStartTour: (val: boolean) => void;
}

export const usePurchaseTourStore = create<PurchaseTourState>()(
  persist(
    (set) => ({
      hasCompletedPurchaseTour: false,
      isIntroModalOpen: false,
      shouldAutoStartTour: false,
      openIntroModal: () => set({ isIntroModalOpen: true }),
      closeIntroModal: () => set({ isIntroModalOpen: false }),
      completeTour: () =>
        set({
          hasCompletedPurchaseTour: true,
          isIntroModalOpen: false,
          shouldAutoStartTour: false,
        }),
      resetTour: () =>
        set({
          hasCompletedPurchaseTour: false,
          isIntroModalOpen: true,
          shouldAutoStartTour: false,
        }),
      setShouldAutoStartTour: (val) => set({ shouldAutoStartTour: val }),
    }),
    {
      name: 'ministore-purchase-tour-storage',
    }
  )
);

