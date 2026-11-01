import { AlertTriangle, RotateCcw, Package } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { BulkImportItemValidation, BulkImportValidationResult } from '../../../types';
import type { FilterTab } from '../../../hooks/logic/useProductsBulkImport';
import { ProductImportPreviewTable } from './ProductImportPreviewTable';

export interface ProductImportPreviewStepProps {
  validationResult: BulkImportValidationResult;
  fileName?: string;
  filterTab: FilterTab;
  setFilterTab: (tab: FilterTab) => void;
  filteredRows: BulkImportItemValidation[];
  isExecuting: boolean;
  handleReset: () => void;
  handleExecuteImport: () => Promise<void>;
}

export function ProductImportPreviewStep({
  validationResult,
  fileName,
  filterTab,
  setFilterTab,
  filteredRows,
  isExecuting,
  handleReset,
  handleExecuteImport,
}: ProductImportPreviewStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-secondary)] font-medium">Total Filas Leídas</span>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{validationResult.totalRows}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Listos para Importar</span>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{validationResult.validCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Duplicados Detectados</span>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{validationResult.duplicateCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Con Errores</span>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{validationResult.invalidCount}</p>
        </div>
      </div>

      {(validationResult.duplicateCount > 0 || validationResult.invalidCount > 0) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-bold">Regla de protección del catálogo:</span> Los registros duplicados o con
            errores de catálogo serán omitidos automáticamente. Solo se procesarán los{' '}
            <span className="font-semibold underline">{validationResult.validCount} artículos válidos</span>.
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
            Válidos ({validationResult.validCount})
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
            Con Errores o Duplicados ({validationResult.duplicateCount + validationResult.invalidCount})
          </button>
        </div>

        {fileName && (
          <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            <span>Archivo:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{fileName}</span>
          </div>
        )}
      </div>

      <ProductImportPreviewTable rows={filteredRows} />

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Subir Otro Archivo
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={() => void handleExecuteImport()}
          loading={isExecuting}
          disabled={validationResult.validCount === 0 || isExecuting}
          leftIcon={<Package className="w-4 h-4" />}
        >
          {validationResult.validCount === 0
            ? 'No hay artículos válidos para importar'
            : `Confirmar e Importar ${validationResult.validCount} Artículo${
                validationResult.validCount > 1 ? 's' : ''
              }`}
        </Button>
      </div>
    </div>
  );
}
