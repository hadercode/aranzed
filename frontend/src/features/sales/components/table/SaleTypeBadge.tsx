import type { SaleType } from '../../types';

export interface SaleTypeBadgeProps {
  type: SaleType;
}

export function SaleTypeBadge({ type }: SaleTypeBadgeProps) {
  if (type === 'QUOTATION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
        Cotización
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Venta Directa
    </span>
  );
}
