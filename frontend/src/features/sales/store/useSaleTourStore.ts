import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SaleTourState {
  hasCompletedSaleTour: boolean;
  isIntroModalOpen: boolean;
  shouldAutoStartTour: boolean;
  openIntroModal: () => void;
  closeIntroModal: () => void;
  completeTour: () => void;
  resetTour: () => void;
  setShouldAutoStartTour: (val: boolean) => void;
}

export const useSaleTourStore = create<SaleTourState>()(
  persist(
    (set) => ({
      hasCompletedSaleTour: false,
      isIntroModalOpen: false,
      shouldAutoStartTour: false,
      openIntroModal: () => set({ isIntroModalOpen: true }),
      closeIntroModal: () => set({ isIntroModalOpen: false }),
      completeTour: () => set({ hasCompletedSaleTour: true, isIntroModalOpen: false, shouldAutoStartTour: false }),
      resetTour: () => set({ hasCompletedSaleTour: false, isIntroModalOpen: true, shouldAutoStartTour: false }),
      setShouldAutoStartTour: (val) => set({ shouldAutoStartTour: val }),
    }),
    {
      name: 'ministore-sale-tour-storage',
    }
  )
);
