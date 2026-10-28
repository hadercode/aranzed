import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  ShoppingBag,
  Boxes,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { TutorialItem } from '../../data/tutorials.data';

interface TutorialCardProps {
  tutorial: TutorialItem;
  onSelect: (tutorial: TutorialItem) => void;
}

export function TutorialCard({ tutorial, onSelect }: TutorialCardProps) {
  const getIcon = () => {
    switch (tutorial.category) {
      case 'Compras':
        return <ShoppingCart className="w-5 h-5" />;
      case 'Ventas':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Inventario':
        return <Boxes className="w-5 h-5" />;
      case 'Recetas':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getGradientClass = () => {
    switch (tutorial.badgeColor) {
      case 'cyan':
        return 'from-cyan-500/15 text-[#22B2B8] dark:from-cyan-500/25 dark:text-[#38D5DB] border-cyan-500/25';
      case 'pink':
        return 'from-rose-500/15 text-[#F43F5E] dark:from-rose-500/25 dark:text-[#FB7185] border-rose-500/25';
      case 'amber':
        return 'from-amber-500/15 text-[#F59E0B] dark:from-amber-500/25 dark:text-[#FBBF24] border-amber-500/25';
      case 'purple':
        return 'from-purple-500/15 text-[#8B5CF6] dark:from-purple-500/25 dark:text-[#A78BFA] border-purple-500/25';
    }
  };

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getGradientClass()} border flex items-center justify-center shrink-0 shadow-xs`}
          >
            {getIcon()}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] px-2.5 py-1 rounded-full">
              {tutorial.duration}
            </span>
          </div>
        </div>

        {/* Category & Title */}
        <span
          className={`text-[11px] font-bold tracking-wider uppercase ${
            tutorial.badgeColor === 'cyan'
              ? 'text-[#22B2B8] dark:text-[#38D5DB]'
              : tutorial.badgeColor === 'pink'
              ? 'text-[#F43F5E] dark:text-[#FB7185]'
              : tutorial.badgeColor === 'amber'
              ? 'text-[#F59E0B] dark:text-[#FBBF24]'
              : 'text-[#8B5CF6] dark:text-[#A78BFA]'
          }`}
        >
          {tutorial.category}
        </span>
        <h3 className="text-base font-bold text-[var(--color-text-primary)] mt-1 group-hover:text-[#22B2B8] transition-colors leading-snug">
          {tutorial.title}
        </h3>

        {/* Summary Description */}
        <p className="text-xs text-[var(--color-text-secondary)] mt-2 line-clamp-3 leading-relaxed">
          {tutorial.summary}
        </p>

        {/* Step Preview Pill */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22B2B8]" />
          <span>{tutorial.steps.length} pasos sencillos guiados</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-5 mt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(tutorial)}
          className="text-xs font-bold text-[#22B2B8] dark:text-[#38D5DB] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ver tutorial</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>

        <Link
          to={tutorial.actionUrl}
          className="text-[11px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] px-2.5 py-1 rounded-lg transition-colors"
          title={`Ir a ${tutorial.actionLabel}`}
        >
          Iniciar
        </Link>
      </div>
    </div>
  );
}

export default TutorialCard;
