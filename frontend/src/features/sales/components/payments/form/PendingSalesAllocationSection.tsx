import { Sparkles, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { PendingSaleForPayment } from '../../../types';

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
  const isFullyAllocated =
    Math.abs(remainingToAllocateUsd) <= 0.01 && totalAmountUsd > 0;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            Ventas Pendientes y Cruce de Saldos
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Distribuye el pago entre las facturas pendientes. Se cerrarán automáticamente aquellas que queden con saldo cero.
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

      {/* Resumen de Asignación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="text-[var(--color-text-muted)] block">
            Monto a Cobrar:
          </span>
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            ${totalAmountUsd.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] block">
            Total Asignado:
          </span>
          <span
            className={`text-base font-bold ${
              isOverAllocated ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            ${totalAllocatedUsd.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] block">
            Saldo por Asignar:
          </span>
          <span
            className={`text-base font-bold ${
              isOverAllocated
                ? 'text-rose-600'
                : isFullyAllocated
                ? 'text-emerald-600'
                : 'text-amber-600'
            }`}
          >
            ${remainingToAllocateUsd.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Alerta de Sobre-asignación */}
      {isOverAllocated && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            El monto asignado supera el monto total del cobro. Reduce alguna asignación antes de continuar.
          </span>
        </div>
      )}

      {/* Tabla de Facturas Pendientes */}
      {isLoadingPending ? (
        <div className="py-12 text-center text-xs text-[var(--color-text-muted)]">
          Cargando facturas pendientes...
        </div>
      ) : pendingSales.length === 0 ? (
        <div className="py-10 text-center space-y-2 border border-dashed border-[var(--color-border)] rounded-xl">
          <FileText className="w-8 h-8 text-[var(--color-text-muted)] mx-auto opacity-50" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            No hay facturas pendientes para este cliente
          </p>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
            Todas sus ventas están completamente pagadas o no se encontraron coincidencias con el término de búsqueda.
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
              {pendingSales.map((sale) => {
                const alloc = allocations[sale.id] || {
                  amount: 0,
                  closeWithDiff: false,
                };
                const assigned = alloc.amount || 0;
                const newBalance = Math.max(0, Number((sale.balance - assigned).toFixed(2)));
                const isCleared = newBalance <= 0.01 && assigned > 0;

                return (
                  <tr
                    key={sale.id}
                    className={`hover:bg-[var(--color-surface-hover)] transition-colors ${
                      assigned > 0 ? 'bg-sage-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-xs text-[var(--color-text-primary)]">
                        {sale.saleNumber}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        {sale.customerName}
                      </p>
                    </td>

                    <td className="py-3 px-3 text-[var(--color-text-secondary)] whitespace-nowrap">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-[var(--color-text-secondary)]">
                      ${sale.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right text-[var(--color-text-muted)]">
                      ${sale.paidAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <p className="font-bold text-[var(--color-text-primary)]">
                        ${sale.balance.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                        Bs. {sale.balanceLocal.toFixed(2)}
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
                            $
                          </span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            max={sale.balance}
                            value={assigned === 0 ? '' : assigned}
                            onChange={(e) =>
                              onAllocationChange(
                                sale.id,
                                Math.max(0, parseFloat(e.target.value) || 0),
                              )
                            }
                            placeholder="0.00"
                            className={`w-full pl-6 pr-2 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-surface-bg)] border text-[var(--color-text-primary)] focus:outline-none ${
                              assigned > 0
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-[var(--color-border)]'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => onFillMaxForSale(sale)}
                          className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-[var(--color-surface-bg)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-sage-600 whitespace-nowrap"
                          title="Cubrir saldo pendiente con el monto restante"
                        >
                          Cubrir
                        </button>
                      </div>
                      {isCleared && (
                        <p className="text-[10px] text-emerald-600 text-center font-semibold mt-1">
                          ✓ Queda saldada
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer text-[var(--color-text-secondary)]">
                        <input
                          type="checkbox"
                          checked={alloc.closeWithDiff}
                          onChange={(e) =>
                            onToggleCloseDiff(sale.id, e.target.checked)
                          }
                          className="w-3.5 h-3.5 rounded text-sage-600 focus:ring-sage-500 border-[var(--color-border)]"
                        />
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          ≤ $0.05
                        </span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
