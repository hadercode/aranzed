import { ArrowRight } from 'lucide-react';
import type { ImportStep } from '../../../hooks/logic/useProductsBulkImport';

export function ProductImportStepsHeader({ step }: { step: ImportStep }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            step === 'upload' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/20 text-emerald-600'
          }`}
        >
          1
        </div>
        <span
          className={`text-sm font-medium ${
            step === 'upload' ? 'text-[var(--color-text-primary)] font-semibold' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          Subir Archivo
        </span>
      </div>

      <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />

      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            step === 'preview'
              ? 'bg-emerald-600 text-white'
              : step === 'success'
              ? 'bg-emerald-500/20 text-emerald-600'
              : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
          }`}
        >
          2
        </div>
        <span
          className={`text-sm font-medium ${
            step === 'preview' ? 'text-[var(--color-text-primary)] font-semibold' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          Validación y Vista Previa
        </span>
      </div>

      <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />

      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            step === 'success' ? 'bg-emerald-600 text-white' : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
          }`}
        >
          3
        </div>
        <span
          className={`text-sm font-medium ${
            step === 'success' ? 'text-[var(--color-text-primary)] font-semibold' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          Procesamiento
        </span>
      </div>
    </div>
  );
}
