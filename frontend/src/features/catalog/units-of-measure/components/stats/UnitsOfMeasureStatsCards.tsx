import { Scale, CheckCircle2, XCircle, Binary, Box } from 'lucide-react';
import { useUnitsOfMeasureContext } from '../../context';
import type { UomStats } from '../../types';

export interface UnitsOfMeasureStatsCardsProps {
  stats?: UomStats;
}

export function UnitsOfMeasureStatsCards({ stats: propStats }: UnitsOfMeasureStatsCardsProps) {
  const context = useUnitsOfMeasureContext();
  const stats = propStats ?? context.stats;

  const cards = [
    {
      title: 'Total Unidades',
      value: stats.total,
      description: 'Configuradas en sistema',
      icon: <Scale className="w-5 h-5" />,
      colorClass: 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10',
    },
    {
      title: 'Activas',
      value: stats.active,
      description: 'Habilitadas para productos',
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'Inactivas',
      value: stats.inactive,
      description: 'Deshabilitadas',
      icon: <XCircle className="w-5 h-5" />,
      colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20',
    },
    {
      title: 'Permiten Decimales',
      value: stats.allowDecimals,
      description: 'Cantidades fraccionarias (ej: kg, m)',
      icon: <Binary className="w-5 h-5" />,
      colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Solo Enteros',
      value: stats.integersOnly,
      description: 'Cantidades discretas (ej: piezas, unid)',
      icon: <Box className="w-5 h-5" />,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          <div className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {card.value}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1 truncate">
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UnitsOfMeasureStatsCards;
