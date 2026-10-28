import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '@/shared/components/ui';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import type { TutorialItem } from '../../data/tutorials.data';

interface TutorialModalProps {
  tutorial: TutorialItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ tutorial, isOpen, onClose }: TutorialModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset to first step whenever a new tutorial is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen, tutorial]);

  if (!tutorial) return null;

  const currentStep = tutorial.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tutorial.steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      <div className="space-y-6 pt-1">
        {/* Tutorial Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tutorial.badgeColor === 'cyan'
                  ? 'badge-cyan'
                  : tutorial.badgeColor === 'pink'
                  ? 'badge-fuchsia'
                  : tutorial.badgeColor === 'amber'
                  ? 'badge-yellow'
                  : 'badge-purple'
              }`}
            >
              {tutorial.category}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              ⏱ Tiempo estimado: {tutorial.duration}
            </span>
          </div>

          <span className="text-xs font-mono font-medium text-[var(--color-text-muted)]">
            Paso {currentStepIndex + 1} de {tutorial.steps.length}
          </span>
        </div>

        {/* Title & Summary */}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {tutorial.title}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
            {tutorial.summary}
          </p>
        </div>

        {/* Interactive Stepper Indicator */}
        <div className="flex items-center gap-2 py-2">
          {tutorial.steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#22B2B8] to-[#8B5CF6] scale-y-125'
                    : isCompleted
                    ? 'bg-[#22B2B8]'
                    : 'bg-gray-200 dark:bg-gray-800'
                }`}
                title={`Ir al paso ${step.stepNumber}: ${step.title}`}
              />
            );
          })}
        </div>

        {/* Active Step Content Card */}
        <div className="rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22B2B8] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              {currentStep.stepNumber}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                {currentStep.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Pro Tip Box (visible on last step or generally) */}
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--color-text-primary)] leading-relaxed">
              <span className="font-bold text-amber-600 dark:text-amber-400">
                Consejo Pro Aranzed:{' '}
              </span>
              {tutorial.proTip}
            </div>
          </div>
        </div>

        {/* Footer Actions: Navigation & Direct Link */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Back/Next Step Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLastStep}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Button to Start Workflow */}
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
      </div>
    </Modal>
  );
}

export default TutorialModal;
