import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { DollarSign, AlertCircle, Clock } from "lucide-react";
import type { Sale } from "../../../types";
import { ReceiptViewerModal } from "./ReceiptViewerModal";
import { useSalePaymentsHistory } from "../../../hooks/logic/useSalePaymentsHistory";
import { SalePaymentsSummaryCard } from "./SalePaymentsSummaryCard";
import { SalePaymentsHistoryTable } from "./SalePaymentsHistoryTable";

export interface SalePaymentsHistoryModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickPayment?: (sale: Sale) => void;
}

export function SalePaymentsHistoryModal({
  sale,
  isOpen,
  onClose,
  onOpenQuickPayment,
}: SalePaymentsHistoryModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <SalePaymentsHistoryContent
      key={sale.id}
      sale={sale}
      isOpen={isOpen}
      onClose={onClose}
      onOpenQuickPayment={onOpenQuickPayment}
    />
  );
}

function SalePaymentsHistoryContent({
  sale,
  isOpen,
  onClose,
  onOpenQuickPayment,
}: {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickPayment?: (sale: Sale) => void;
}) {
  const history = useSalePaymentsHistory(sale.id);
  const pendingUsd = Math.max(0, Number((sale.total - (sale.paidAmount || 0)).toFixed(2)));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Historial de Cobros y Abonos" size="lg">
        <div className="flex items-center gap-2 mb-4 -mt-2">
          <div className="p-1.5 rounded-lg bg-sage-500/10 text-sage-600 dark:text-sage-400">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Venta {sale.saleNumber} &bull; {sale.customerName}
          </p>
        </div>

        <div className="space-y-4">
          <SalePaymentsSummaryCard
            total={sale.total}
            paidAmount={sale.paidAmount}
            totalLocal={sale.totalLocal}
            paidAmountLocal={sale.paidAmountLocal}
          />

          {history.isLoading ? (
            <div className="py-12 text-center text-xs text-[var(--color-text-muted)]">
              Cargando historial de pagos...
            </div>
          ) : history.error ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{history.error}</span>
            </div>
          ) : history.payments.length === 0 ? (
            <div className="py-8 text-center space-y-2 border border-dashed border-[var(--color-border)] rounded-xl">
              <DollarSign className="w-8 h-8 text-[var(--color-text-muted)] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                No hay cobros aplicados a esta venta todavía
              </p>
              <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
                Puedes registrar un cobro directo usando el botón de abajo o cruzando un pago desde el formulario de cobros.
              </p>
            </div>
          ) : (
            <SalePaymentsHistoryTable
              payments={history.payments}
              saleId={sale.id}
              onOpenReceipt={history.handleOpenReceipt}
            />
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
            {pendingUsd > 0.01 && onOpenQuickPayment ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenQuickPayment(sale);
                }}
                leftIcon={<DollarSign className="w-4 h-4" />}
              >
                Registrar Abono a esta Venta
              </Button>
            ) : (
              <div />
            )}
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      <ReceiptViewerModal
        isOpen={Boolean(history.viewerReceiptUrl)}
        receiptUrl={history.viewerReceiptUrl}
        title="Comprobante de Pago"
        onClose={history.handleCloseReceipt}
      />
    </>
  );
}
