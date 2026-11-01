import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecipeTourState {
  hasCompletedRecipeTour: boolean;
  isIntroModalOpen: boolean;
  shouldAutoStartTour: boolean;
  openIntroModal: () => void;
  closeIntroModal: () => void;
  completeTour: () => void;
  resetTour: () => void;
  setShouldAutoStartTour: (val: boolean) => void;
}

export const useRecipeTourStore = create<RecipeTourState>()(
  persist(
    (set) => ({
      hasCompletedRecipeTour: false,
      isIntroModalOpen: false,
      shouldAutoStartTour: false,
      openIntroModal: () => set({ isIntroModalOpen: true }),
      closeIntroModal: () => set({ isIntroModalOpen: false }),
      completeTour: () =>
        set({
          hasCompletedRecipeTour: true,
          isIntroModalOpen: false,
          shouldAutoStartTour: false,
        }),
      resetTour: () =>
        set({
          hasCompletedRecipeTour: false,
          isIntroModalOpen: true,
          shouldAutoStartTour: false,
        }),
      setShouldAutoStartTour: (val) => set({ shouldAutoStartTour: val }),
    }),
    {
      name: 'ministore-recipe-tour-storage',
    }
  )
);

