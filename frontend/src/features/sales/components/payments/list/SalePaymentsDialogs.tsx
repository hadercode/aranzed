import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { AlertCircle } from "lucide-react";
import type { SalePayment } from "../../../types";
import { ReceiptViewerModal } from "../modal/ReceiptViewerModal";

export interface SalePaymentsDialogsProps {
  cancelTarget: SalePayment | null;
  cancelReason: string;
  onCancelReasonChange: (val: string) => void;
  isCancelling: boolean;
  actionError: string | null;
  onCloseCancel: () => void;
  onConfirmCancel: () => void;
  viewerReceiptUrl: string | null;
  onCloseReceipt: () => void;
}

export function SalePaymentsDialogs({
  cancelTarget,
  cancelReason,
  onCancelReasonChange,
  isCancelling,
  actionError,
  onCloseCancel,
  onConfirmCancel,
  viewerReceiptUrl,
  onCloseReceipt,
}: SalePaymentsDialogsProps) {
  return (
    <>
      {/* Diálogo de Confirmación de Anulación */}
      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        title="¿Anular este Cobro?"
        message={
          <div className="space-y-3 pt-2 text-left">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Estás por anular el cobro{" "}
              <strong className="text-[var(--color-text-primary)] font-mono">
                {cancelTarget?.paymentNumber}
              </strong>{" "}
              por un monto de{" "}
              <strong className="text-emerald-600">
                ${Number(cancelTarget?.amount || 0).toFixed(2)}
              </strong>
              .
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              ⚠️ Esta acción revertirá atómicamente los saldos y recalculará el
              estado de pago (PAGADO / ABONADO / PENDIENTE) de todas las
              facturas cruzadas.
            </div>

            <div className="space-y-1">
              <label
                htmlFor="sale-payment-cancel-reason"
                className="text-xs font-medium text-[var(--color-text-secondary)]"
              >
                Motivo de la anulación (opcional):
              </label>
              <textarea
                id="sale-payment-cancel-reason"
                rows={2}
                value={cancelReason}
                onChange={(e) => onCancelReasonChange(e.target.value)}
                placeholder="Ej: Transferencia rebotada por el banco, error en el monto..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {actionError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
          </div>
        }
        confirmText="Sí, Anular Cobro"
        cancelText="Descartar"
        variant="danger"
        loading={isCancelling}
        onConfirm={onConfirmCancel}
        onClose={onCloseCancel}
      />

      {/* Visor de Comprobante Lightbox */}
      <ReceiptViewerModal
        isOpen={Boolean(viewerReceiptUrl)}
        receiptUrl={viewerReceiptUrl}
        title="Comprobante de Pago Adjunto"
        onClose={onCloseReceipt}
      />
    </>
  );
}
