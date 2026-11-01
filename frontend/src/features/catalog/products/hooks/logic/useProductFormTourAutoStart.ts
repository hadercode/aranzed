import { useEffect } from 'react';
import { useProductTour } from './useProductTour';
import { useProductTourStore } from '../../store';

export function useProductFormTourAutoStart(loadingInitial: boolean, loadError: string | null) {
  const { startInteractiveTour } = useProductTour();
  const { shouldAutoStartTour, setShouldAutoStartTour } = useProductTourStore();

  useEffect(() => {
    if (!loadingInitial && !loadError && shouldAutoStartTour) {
      setShouldAutoStartTour(false);
      const timer = setTimeout(() => {
        startInteractiveTour();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [
    loadingInitial,
    loadError,
    shouldAutoStartTour,
    setShouldAutoStartTour,
    startInteractiveTour,
  ]);
}

