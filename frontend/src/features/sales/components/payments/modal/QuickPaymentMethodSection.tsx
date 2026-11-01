import type { PaymentMethod } from "../../../types";

interface QuickPaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  reference: string;
  setReference: (r: string) => void;
  paymentDate: string;
  setPaymentDate: (d: string) => void;
}

export function QuickPaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
  reference,
  setReference,
  paymentDate,
  setPaymentDate,
}: QuickPaymentMethodSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="space-y-1">
        <label htmlFor="quick-pay-method" className="text-xs font-medium text-[var(--color-text-secondary)]">
          Método
        </label>
        <select
          id="quick-pay-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
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
        <label htmlFor="quick-pay-ref" className="text-xs font-medium text-[var(--color-text-secondary)]">
          Referencia Bancaria
        </label>
        <input
          id="quick-pay-ref"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Nº transacción"
          className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="quick-pay-date" className="text-xs font-medium text-[var(--color-text-secondary)]">
          Fecha
        </label>
        <input
          id="quick-pay-date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full px-2.5 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
        />
      </div>
    </div>
  );
}

