import { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/ui';
import { Lightbulb } from 'lucide-react';
import type { TutorialItem } from '../../data/tutorials.data';
import { TutorialStepHeader } from './TutorialStepHeader';
import { TutorialStepFooter } from './TutorialStepFooter';

interface TutorialModalProps {
  tutorial: TutorialItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ tutorial, isOpen, onClose }: TutorialModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
    if (!isLastStep) setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6 pt-1">
        <TutorialStepHeader
          tutorial={tutorial}
          currentStepIndex={currentStepIndex}
          totalSteps={tutorial.steps.length}
        />

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

        <TutorialStepFooter
          tutorial={tutorial}
          currentStepIndex={currentStepIndex}
          totalSteps={tutorial.steps.length}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={onClose}
        />
      </div>
    </Modal>
  );
}

export default TutorialModal;
