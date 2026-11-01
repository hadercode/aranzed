import { useState } from 'react';
import { AlertTriangle, RotateCcw, Package } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { BulkStockImportValidationResult, BulkStockImportItemValidation } from '../../types';
import { StockImportPreviewTable } from './StockImportPreviewTable';
import { StockImportStatsCards } from './StockImportStatsCards';

interface StockImportPreviewStepProps {
  validationResult: BulkStockImportValidationResult;
  fileName?: string;
  isExecuting: boolean;
  onReset: () => void;
  onExecute: () => void;
}

export function StockImportPreviewStep({
  validationResult,
  fileName,
  isExecuting,
  onReset,
  onExecute,
}: StockImportPreviewStepProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'valid' | 'skipped' | 'errors'>('all');

  const filteredRows = validationResult.rows.filter((row: BulkStockImportItemValidation) => {
    if (filterTab === 'valid') return row.status === 'VALID';
    if (filterTab === 'skipped') return row.status === 'SKIPPED';
    if (filterTab === 'errors') return row.status === 'INVALID' || row.status === 'DUPLICATE';
    return true;
  });

  return (
    <div className="space-y-5">
      <StockImportStatsCards validationResult={validationResult} />

      {(validationResult.duplicateCount > 0 || validationResult.invalidCount > 0) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-bold">Protección de consistencia:</span> Los registros con errores serán omitidos.
            Solo se procesarán los <span className="font-semibold underline">{validationResult.validCount} artículos válidos</span>.
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--color-surface-hover)] rounded-2xl border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[var(--color-surface-card)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Todos ({validationResult.totalRows})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('valid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'valid'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-emerald-600'
            }`}
          >
            Listos ({validationResult.validCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('skipped')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'skipped'
                ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-slate-600'
            }`}
          >
            Omitidos ({validationResult.skippedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('errors')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'errors'
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-rose-600'
            }`}
          >
            Con Errores ({validationResult.invalidCount + validationResult.duplicateCount})
          </button>
        </div>

        {fileName && (
          <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            <span>Archivo:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{fileName}</span>
          </div>
        )}
      </div>

      <StockImportPreviewTable rows={filteredRows} />

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Subir Otro Archivo
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onExecute}
          loading={isExecuting}
          disabled={validationResult.validCount === 0 || isExecuting}
          leftIcon={<Package className="w-4 h-4" />}
        >
          {validationResult.validCount === 0
            ? 'No hay artículos con cantidad para cargar'
            : `Ingresar ${validationResult.validCount} Artículo${validationResult.validCount > 1 ? 's' : ''} al Inventario`}
        </Button>
      </div>
    </div>
  );
}
