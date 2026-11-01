import { CheckCircle2, Layers } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { BulkStockImportSummary } from '../../types';

interface StockImportResultStepProps {
  summary: BulkStockImportSummary;
  onClose: () => void;
}

export function StockImportResultStep({ summary, onClose }: StockImportResultStepProps) {
  return (
    <div className="py-8 px-4 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
          ¡Saldos Iniciales Ingresados!
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Se han creado satisfactoriamente las capas de stock y los movimientos de Kárdex para{' '}
          <span className="font-bold text-emerald-600">
            {summary.createdCount} artículos
          </span>{' '}
          en sus respectivos almacenes.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center gap-6 text-xs text-[var(--color-text-secondary)]">
        <div>
          <span className="block font-medium">Procesados</span>
          <span className="font-bold text-base text-[var(--color-text-primary)]">
            {summary.totalProcessed}
          </span>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <span className="block font-medium text-emerald-600">Ingresados con Éxito</span>
          <span className="font-bold text-base text-emerald-600">
            {summary.createdCount}
          </span>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <span className="block font-medium">Fallos / Errores</span>
          <span className="font-bold text-base text-[var(--color-text-primary)]">
            {summary.failedCount}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onClose}
        leftIcon={<Layers className="w-4 h-4" />}
        className="mt-4"
      >
        Finalizar y Ver Existencias
      </Button>
    </div>
  );
}
