import type { TutorialItem } from '../../data/tutorials.data';

interface TutorialStepHeaderProps {
  tutorial: TutorialItem;
  currentStepIndex: number;
  totalSteps: number;
}

export function TutorialStepHeader({
  tutorial,
  currentStepIndex,
  totalSteps,
}: TutorialStepHeaderProps) {
  return (
    <>
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
          Paso {currentStepIndex + 1} de {totalSteps}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          {tutorial.title}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
          {tutorial.summary}
        </p>
      </div>
    </>
  );
}
