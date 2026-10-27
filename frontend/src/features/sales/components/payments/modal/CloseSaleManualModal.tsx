import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { CheckSquare, AlertCircle } from "lucide-react";
import type { Sale } from "../../../types";
import { useCloseSaleManual } from "../../../hooks/logic/useCloseSaleManual";

export interface CloseSaleManualModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CloseSaleManualModal({
  sale,
  isOpen,
  onClose,
  onSuccess,
}: CloseSaleManualModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <CloseSaleManualContent
      key={sale.id}
      sale={sale}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function CloseSaleManualContent({
  sale,
  isOpen,
  onClose,
  onSuccess,
}: {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const manualClose = useCloseSaleManual({ sale, onSuccess, onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cierre Manual de Venta"
      size="md"
    >
      <div className="flex items-center gap-2 mb-4 -mt-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <CheckSquare className="w-4 h-4" />
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Ajustar diferencia mínima y dar por saldada la factura
        </p>
      </div>

      <form onSubmit={manualClose.handleSubmit} className="space-y-4">
        {/* Info de la Venta */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Venta:</span>
            <span className="font-mono font-bold text-[var(--color-text-primary)]">
              {sale.saleNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Cliente:</span>
            <span className="font-medium text-[var(--color-text-primary)]">
              {sale.customerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">
              Total Factura:
            </span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              ${sale.total.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">
              Monto Cobrado:
            </span>
            <span className="font-semibold text-emerald-600">
              ${(sale.paidAmount || 0).toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[var(--color-border)]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Diferencia / Saldo Restante:
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ${manualClose.pendingUsd.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Monto de Ajuste */}
        <div className="space-y-1">
          <label
            htmlFor="manual-close-diff-adj"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Monto de Ajuste / Descuento por Redondeo ($ USD)
          </label>
          <input
            id="manual-close-diff-adj"
            type="number"
            step="any"
            min="0"
            value={manualClose.differenceAdjustment}
            onChange={(e) =>
              manualClose.setDifferenceAdjustment(
                parseFloat(e.target.value) || 0,
              )
            }
            className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Motivo del Ajuste */}
        <div className="space-y-1">
          <label
            htmlFor="manual-close-reason-input"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Motivo del Cierre Manual *
          </label>
          <textarea
            id="manual-close-reason-input"
            rows={2}
            value={manualClose.reason}
            onChange={(e) => manualClose.setReason(e.target.value)}
            placeholder="Ej: Diferencia por centavos cambiarios autorizada por gerencia"
            className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            required
          />
        </div>

        {/* Error */}
        {manualClose.error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{manualClose.error}</span>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={manualClose.isSubmitting}
            disabled={manualClose.isSubmitting}
          >
            Cerrar Venta como PAGADA
          </Button>
        </div>
      </form>
    </Modal>
  );
}
