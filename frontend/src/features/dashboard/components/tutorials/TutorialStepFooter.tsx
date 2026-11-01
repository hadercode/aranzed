import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import type { TutorialItem } from '../../data/tutorials.data';

interface TutorialStepFooterProps {
  tutorial: TutorialItem;
  currentStepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function TutorialStepFooter({
  tutorial,
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onClose,
}: TutorialStepFooterProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstStep}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isLastStep}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <Link
        to={tutorial.actionUrl}
        onClick={onClose}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] hover:opacity-95 shadow-md shadow-pink-500/15 transition-all cursor-pointer"
      >
        {isLastStep ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <ExternalLink className="w-4 h-4" />
        )}
        <span>{tutorial.actionLabel}</span>
      </Link>
    </div>
  );
}
