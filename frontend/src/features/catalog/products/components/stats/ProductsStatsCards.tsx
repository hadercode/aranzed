import { Package, ShoppingBag, Boxes, Layers, Wrench, CheckCircle2 } from 'lucide-react';
import { useProductsContext } from '../../context';
import type { ProductStats } from '../../types';

export interface ProductsStatsCardsProps {
  stats?: ProductStats;
}

export function ProductsStatsCards({ stats: propStats }: ProductsStatsCardsProps) {
  const context = useProductsContext();
  const stats = propStats ?? context.stats;

  const cards = [
    {
      title: 'Total Catálogo',
      value: stats.total,
      description: 'Artículos registrados',
      icon: <Package className="w-5 h-5" />,
      colorClass: 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10',
    },
    {
      title: 'Tradicionales',
      value: stats.traditional,
      description: 'Comercialización estándar',
      icon: <ShoppingBag className="w-5 h-5" />,
      colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Materia Prima',
      value: stats.rawMaterial,
      description: 'Insumos de producción',
      icon: <Boxes className="w-5 h-5" />,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'Terminados',
      value: stats.finishedGood,
      description: 'Manufactura / Ensamblaje',
      icon: <Layers className="w-5 h-5" />,
      colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Servicios',
      value: stats.service,
      description: 'Intangibles y mano de obra',
      icon: <Wrench className="w-5 h-5" />,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    },
    {
      title: 'Activos',
      value: stats.active,
      description: 'Disponibles para venta',
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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

export default ProductsStatsCards;
