import { ScrollText, CheckCircle2, FileEdit, Archive, DollarSign } from 'lucide-react';
import { useRecipesContext } from '../../context';

export function RecipesStatsCards() {
  const { stats, loading } = useRecipesContext();

  const cards = [
    {
      title: 'Total Recetas',
      value: stats.total,
      description: 'Fórmulas registradas',
      icon: <ScrollText className="w-5 h-5" />,
      colorClass: 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10',
    },
    {
      title: 'Recetas Activas',
      value: stats.active,
      description: 'Vigentes para producción',
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'En Borrador',
      value: stats.draft,
      description: 'En diseño / revisión',
      icon: <FileEdit className="w-5 h-5" />,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    },
    {
      title: 'Inactivas',
      value: stats.inactive,
      description: 'Versiones archivadas',
      icon: <Archive className="w-5 h-5" />,
      colorClass: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30',
    },
    {
      title: 'Costo Promedio',
      value: `$${stats.avgCost.toFixed(2)}`,
      description: 'Por receta BOM',
      icon: <DollarSign className="w-5 h-5" />,
      colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs hover:border-[var(--color-border-hover,var(--color-border))] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl ${card.colorClass}`}>{card.icon}</div>
          </div>
          <div className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            {card.value}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
