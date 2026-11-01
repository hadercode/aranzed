import type { BulkStockImportValidationResult } from '../../types';

interface StockImportStatsCardsProps {
  validationResult: BulkStockImportValidationResult;
}

export function StockImportStatsCards({ validationResult }: StockImportStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">Total Filas Leídas</span>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{validationResult.totalRows}</p>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Listos para Ingresar</span>
        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{validationResult.validCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Omitidos (Cant. 0)</span>
        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1">{validationResult.skippedCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
        <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Con Errores / Duplicados</span>
        <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">
          {validationResult.invalidCount + validationResult.duplicateCount}
        </p>
      </div>
    </div>
  );
}

