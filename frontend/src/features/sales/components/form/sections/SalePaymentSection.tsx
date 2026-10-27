import { CreditCard, FileText } from 'lucide-react';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { useSalesFormContext } from '../../../context';

export function SalePaymentSection() {
  const { form } = useSalesFormContext();
  const { register } = form;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)] space-y-5">
      <SectionHeader
        icon={<CreditCard className="w-4 h-4" />}
        title="Forma de Pago y Observaciones"
        description="Condiciones de cobranza pactadas con el cliente y notas comerciales del documento"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Método de Pago */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Método de Pago Acordado
          </label>
          <select
            {...register('paymentMethod')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="CASH">Efectivo (USD / Moneda Local)</option>
            <option value="TRANSFER">Transferencia Bancaria / Pago Móvil</option>
            <option value="CARD">Tarjeta de Débito / Crédito (Punto de Venta)</option>
            <option value="CREDIT">Crédito Comercial (Cuenta por Cobrar)</option>
            <option value="OTHER">Otro Medio de Pago</option>
          </select>
        </div>

        {/* Referencia de Pago */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Referencia / Detalles de Pago
          </label>
          <input
            type="text"
            placeholder="Ej. N° de comprobante, banco emisor, últimos 4 dígitos..."
            {...register('paymentNotes')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Observaciones Generales */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Notas u Observaciones del Documento
          </label>
          <div className="relative">
            <textarea
              rows={2}
              placeholder="Instrucciones de entrega, garantías, validez de la oferta o términos acordados..."
              {...register('notes')}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <FileText className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalePaymentSection;
