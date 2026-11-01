import { useId } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { AlertCircle, DollarSign } from "lucide-react";
import type { Sale } from "../../../types";
import { useQuickPayment } from "../../../hooks/logic/useQuickPayment";
import { QuickPaymentAmountSection } from "./QuickPaymentAmountSection";
import { QuickPaymentMethodSection } from "./QuickPaymentMethodSection";
import { QuickPaymentReceiptUpload } from "./QuickPaymentReceiptUpload";

export interface QuickPaymentModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedSale?: Sale) => void;
}

export function QuickPaymentModal({
  sale,
  isOpen,
  onClose,
  onSuccess,
}: QuickPaymentModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <QuickPaymentContent
      key={sale.id}
      sale={sale}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function QuickPaymentContent({
  sale,
  isOpen,
  onClose,
  onSuccess,
}: {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedSale?: Sale) => void;
}) {
  const fileInputId = useId();
  const payment = useQuickPayment({ sale, onSuccess, onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Cobro Rápido" size="lg">
      <div className="flex items-center gap-2 mb-4 -mt-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <DollarSign className="w-4 h-4" />
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Venta {sale.saleNumber} &bull; {sale.customerName}
        </p>
      </div>

      <form onSubmit={payment.handleSubmit} className="space-y-4">
        <QuickPaymentAmountSection
          sale={sale}
          currency={payment.currency}
          setCurrency={payment.setCurrency}
          amount={payment.amount}
          setAmount={payment.setAmount}
          pendingBalanceUsd={payment.pendingBalanceUsd}
          pendingBalanceVes={payment.pendingBalanceVes}
          amountUsd={payment.amountUsd}
          amountVes={payment.amountVes}
          exchangeRate={payment.exchangeRate}
          setExchangeRate={payment.setExchangeRate}
        />

        <QuickPaymentMethodSection
          paymentMethod={payment.paymentMethod}
          setPaymentMethod={payment.setPaymentMethod}
          reference={payment.reference}
          setReference={payment.setReference}
          paymentDate={payment.paymentDate}
          setPaymentDate={payment.setPaymentDate}
        />

        <QuickPaymentReceiptUpload
          fileInputId={fileInputId}
          receiptUrl={payment.receiptUrl}
          receiptFileName={payment.receiptFileName}
          isUploading={payment.isUploading}
          onFileUpload={payment.handleFileUpload}
          onRemoveReceipt={payment.handleRemoveReceipt}
        />

        {payment.remainingAfterPayment > 0 && payment.remainingAfterPayment <= 0.05 && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <input
              id="quick-close-diff-check"
              type="checkbox"
              checked={payment.closeIfSmallDifference}
              onChange={(e) => payment.setCloseIfSmallDifference(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 border-[var(--color-border)]"
            />
            <label htmlFor="quick-close-diff-check" className="cursor-pointer text-amber-800 dark:text-amber-300 font-medium">
              Ajustar diferencia mínima (${payment.remainingAfterPayment.toFixed(2)}) y marcar como <strong>PAGADO</strong> automáticamente
            </label>
          </div>
        )}

        {payment.error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{payment.error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={payment.isSubmitting}
            disabled={payment.amount <= 0 || payment.isSubmitting}
          >
            Registrar Cobro
          </Button>
        </div>
      </form>
    </Modal>
  );
}
