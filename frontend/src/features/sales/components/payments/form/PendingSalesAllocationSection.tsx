import { Sparkles, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { PendingSaleForPayment } from '../../../types';
import { PendingSaleAllocationRow } from './PendingSaleAllocationRow';
import { PendingSalesSummaryCards } from './PendingSalesSummaryCards';

export interface PendingSalesAllocationSectionProps {
  pendingSales: PendingSaleForPayment[];
  isLoadingPending: boolean;
  allocations: Record<string, { amount: number; closeWithDiff: boolean }>;
  totalAmountUsd: number;
  totalAllocatedUsd: number;
  remainingToAllocateUsd: number;
  onAllocationChange: (saleId: string, val: number) => void;
  onToggleCloseDiff: (saleId: string, checked: boolean) => void;
  onAutoDistribute: () => void;
  onClearAllocations: () => void;
  onFillMaxForSale: (sale: { id: string; balance: number }) => void;
}

export function PendingSalesAllocationSection({
  pendingSales,
  isLoadingPending,
  allocations,
  totalAmountUsd,
  totalAllocatedUsd,
  remainingToAllocateUsd,
  onAllocationChange,
  onToggleCloseDiff,
  onAutoDistribute,
  onClearAllocations,
  onFillMaxForSale,
}: PendingSalesAllocationSectionProps) {
  const isOverAllocated = remainingToAllocateUsd < -0.01;
  const isFullyAllocated = Math.abs(remainingToAllocateUsd) <= 0.01 && totalAmountUsd > 0;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            Ventas Pendientes y Cruce de Saldos
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Distribuye el pago entre las facturas pendientes. Se cerrarán automáticamente aquellas con saldo cero.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearAllocations}
            disabled={Object.keys(allocations).length === 0}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Limpiar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAutoDistribute}
            disabled={totalAmountUsd <= 0 || pendingSales.length === 0}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Auto-Distribuir (FIFO)
          </Button>
        </div>
      </div>

      <PendingSalesSummaryCards
        totalAmountUsd={totalAmountUsd}
        totalAllocatedUsd={totalAllocatedUsd}
        remainingToAllocateUsd={remainingToAllocateUsd}
        isOverAllocated={isOverAllocated}
        isFullyAllocated={isFullyAllocated}
      />

      {isOverAllocated && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>El monto asignado supera el monto total del cobro. Reduce alguna asignación antes de continuar.</span>
        </div>
      )}

      {isLoadingPending ? (
        <div className="py-12 text-center text-xs text-[var(--color-text-muted)]">Cargando facturas pendientes...</div>
      ) : pendingSales.length === 0 ? (
        <div className="py-10 text-center space-y-2 border border-dashed border-[var(--color-border)] rounded-xl">
          <FileText className="w-8 h-8 text-[var(--color-text-muted)] mx-auto opacity-50" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            No hay facturas pendientes para este cliente
          </p>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
            Todas sus ventas están completamente pagadas.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                <th className="py-2.5 px-3 font-semibold">Venta / Factura</th>
                <th className="py-2.5 px-3 font-semibold">Fecha</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total USD</th>
                <th className="py-2.5 px-3 font-semibold text-right">Abonado</th>
                <th className="py-2.5 px-3 font-semibold text-right">Saldo Pendiente</th>
                <th className="py-2.5 px-3 font-semibold text-center w-48">Monto a Imputar</th>
                <th className="py-2.5 px-3 font-semibold text-center">Cerrar con dif.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {pendingSales.map((sale) => (
                <PendingSaleAllocationRow
                  key={sale.id}
                  sale={sale}
                  alloc={allocations[sale.id] || { amount: 0, closeWithDiff: false }}
                  onAllocationChange={onAllocationChange}
                  onToggleCloseDiff={onToggleCloseDiff}
                  onFillMaxForSale={onFillMaxForSale}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PendingSalesAllocationSection;
