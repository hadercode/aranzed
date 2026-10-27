import { CreditCard, Calendar, Hash, FileText } from 'lucide-react';
import type { PaymentMethod } from '../../../types';

export interface PaymentDetailsSectionProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (val: PaymentMethod) => void;
  paymentDate: string;
  onPaymentDateChange: (val: string) => void;
  reference: string;
  onReferenceChange: (val: string) => void;
  notes: string;
  onNotesChange: (val: string) => void;
}

export function PaymentDetailsSection({
  paymentMethod,
  onPaymentMethodChange,
  paymentDate,
  onPaymentDateChange,
  reference,
  onReferenceChange,
  notes,
  onNotesChange,
}: PaymentDetailsSectionProps) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            Detalles de la Transacción
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Forma de pago, fecha contable y referencia de soporte
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Método de Pago */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-method-select"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Método de Pago
          </label>
          <select
            id="payment-method-select"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          >
            <option value="TRANSFER">Transferencia Bancaria</option>
            <option value="MOBILE_PAY">Pago Móvil</option>
            <option value="CASH_USD">Efectivo ($ USD)</option>
            <option value="CASH_VES">Efectivo (Bs VES)</option>
            <option value="POS">Punto de Venta (Tarjeta Débito)</option>
            <option value="ZELLE">Zelle</option>
            <option value="CARD">Tarjeta de Crédito</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        {/* Fecha de Pago */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-date-input"
            className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            Fecha de Cobro
          </label>
          <input
            id="payment-date-input"
            type="date"
            value={paymentDate}
            onChange={(e) => onPaymentDateChange(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        {/* Referencia Bancaria */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-ref-input"
            className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1"
          >
            <Hash className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            Referencia / Nº Operación
          </label>
          <input
            id="payment-ref-input"
            type="text"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="Ej: 0049281, 4 últimos dígitos..."
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <label
          htmlFor="payment-notes-input"
          className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          Observaciones / Notas Adicionales
        </label>
        <textarea
          id="payment-notes-input"
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Comentarios sobre el banco de origen, acuerdo de pago, etc."
          className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
        />
      </div>
    </div>
  );
}
