import { useId } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import {
  Upload,
  X,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";
import type { Sale, PaymentMethod } from "../../../types";
import { useQuickPayment } from "../../../hooks/logic/useQuickPayment";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Cobro Rápido"
      size="lg"
    >
      <div className="flex items-center gap-2 mb-4 -mt-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <DollarSign className="w-4 h-4" />
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Venta {sale.saleNumber} &bull; {sale.customerName}
        </p>
      </div>

      <form onSubmit={payment.handleSubmit} className="space-y-4">
        {/* Resumen de Saldo */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
          <div>
            <span className="text-[var(--color-text-muted)] block">
              Total Venta:
            </span>
            <span className="text-sm font-bold text-[var(--color-text-primary)]">
              ${sale.total.toFixed(2)}{" "}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                (Bs. {sale.totalLocal.toFixed(2)})
              </span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[var(--color-text-muted)] block">
              Saldo Pendiente:
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              ${payment.pendingBalanceUsd.toFixed(2)}{" "}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                (Bs. {payment.pendingBalanceVes.toFixed(2)})
              </span>
            </span>
          </div>
        </div>

        {/* Moneda y Monto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Moneda del Pago
            </label>
            <div className="flex rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] p-1">
              <button
                type="button"
                onClick={() => {
                  payment.setCurrency("USD");
                  payment.setAmount(payment.pendingBalanceUsd);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  payment.currency === "USD"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => {
                  payment.setCurrency("VES");
                  payment.setAmount(payment.pendingBalanceVes);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  payment.currency === "VES"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Bs. VES
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="quick-pay-amount"
              className="text-xs font-medium text-[var(--color-text-secondary)]"
            >
              Monto a Cobrar ({payment.currency === "USD" ? "$" : "Bs."})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
                {payment.currency === "USD" ? "$" : "Bs."}
              </span>
              <input
                id="quick-pay-amount"
                type="number"
                step="any"
                min="0"
                value={payment.amount === 0 ? "" : payment.amount}
                onChange={(e) =>
                  payment.setAmount(
                    Math.max(0, parseFloat(e.target.value) || 0),
                  )
                }
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Tasa y Equivalencia */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-sage-500/5 border border-sage-500/10 text-xs">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-sage-600" />
            <span className="text-[var(--color-text-muted)]">Equivale a:</span>
            <strong className="text-emerald-600 font-bold">
              ${payment.amountUsd.toFixed(2)} USD
            </strong>
            <span className="text-[var(--color-text-muted)]">&bull;</span>
            <strong className="text-blue-600 font-bold">
              Bs. {payment.amountVes.toFixed(2)} VES
            </strong>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
            <span>Tasa:</span>
            <input
              type="number"
              step="any"
              value={payment.exchangeRate}
              onChange={(e) =>
                payment.setExchangeRate(parseFloat(e.target.value) || 1)
              }
              className="w-16 px-1.5 py-0.5 rounded bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-right font-mono"
            />
          </div>
        </div>

        {/* Método, Referencia y Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="quick-pay-method"
              className="text-xs font-medium text-[var(--color-text-secondary)]"
            >
              Método
            </label>
            <select
              id="quick-pay-method"
              value={payment.paymentMethod}
              onChange={(e) =>
                payment.setPaymentMethod(e.target.value as PaymentMethod)
              }
              className="w-full px-2.5 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            >
              <option value="TRANSFER">Transferencia</option>
              <option value="MOBILE_PAY">Pago Móvil</option>
              <option value="CASH_USD">Efectivo ($ USD)</option>
              <option value="CASH_VES">Efectivo (Bs VES)</option>
              <option value="POS">Punto de Venta</option>
              <option value="ZELLE">Zelle</option>
              <option value="CARD">Tarjeta</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="quick-pay-ref"
              className="text-xs font-medium text-[var(--color-text-secondary)]"
            >
              Referencia Bancaria
            </label>
            <input
              id="quick-pay-ref"
              type="text"
              value={payment.reference}
              onChange={(e) => payment.setReference(e.target.value)}
              placeholder="Nº transacción"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="quick-pay-date"
              className="text-xs font-medium text-[var(--color-text-secondary)]"
            >
              Fecha
            </label>
            <input
              id="quick-pay-date"
              type="date"
              value={payment.paymentDate}
              onChange={(e) => payment.setPaymentDate(e.target.value)}
              className="w-full px-2.5 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>
        </div>

        {/* Comprobante de Pago */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Comprobante / Capture (Opcional)
          </label>
          {!payment.receiptUrl ? (
            <div className="border border-dashed border-[var(--color-border)] hover:border-sage-500/50 rounded-xl p-3 text-center transition-colors">
              <input
                id={fileInputId}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={payment.handleFileUpload}
                disabled={payment.isUploading}
                className="hidden"
              />
              <label
                htmlFor={fileInputId}
                className="cursor-pointer flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <Upload className="w-4 h-4 text-sage-600" />
                <span>
                  {payment.isUploading
                    ? "Subiendo comprobante..."
                    : "Adjuntar capture o PDF bancario (Hasta 10MB)"}
                </span>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 min-w-0">
                {payment.receiptUrl.toLowerCase().endsWith(".pdf") ? (
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <img
                    src={payment.receiptUrl}
                    alt="Comprobante"
                    className="w-8 h-8 object-cover rounded border border-[var(--color-border)] shrink-0"
                  />
                )}
                <span className="text-xs text-[var(--color-text-primary)] truncate font-medium">
                  {payment.receiptFileName || "comprobante.jpg"}
                </span>
              </div>
              <button
                type="button"
                onClick={payment.handleRemoveReceipt}
                className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Cierre si queda diferencia mínima */}
        {payment.remainingAfterPayment > 0 &&
          payment.remainingAfterPayment <= 0.05 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <input
                id="quick-close-diff-check"
                type="checkbox"
                checked={payment.closeIfSmallDifference}
                onChange={(e) =>
                  payment.setCloseIfSmallDifference(e.target.checked)
                }
                className="w-4 h-4 rounded text-amber-600 border-[var(--color-border)]"
              />
              <label
                htmlFor="quick-close-diff-check"
                className="cursor-pointer text-amber-800 dark:text-amber-300 font-medium"
              >
                Ajustar diferencia mínima ($
                {payment.remainingAfterPayment.toFixed(2)}) y marcar como{" "}
                <strong>PAGADO</strong> automáticamente
              </label>
            </div>
          )}

        {/* Error */}
        {payment.error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{payment.error}</span>
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
