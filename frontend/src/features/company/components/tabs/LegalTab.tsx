import { useCompanyContext } from '../../context';

export function LegalTab() {
  const { formData, handleChange } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Régimen Tributario / Información Fiscal
          </label>
          <input
            type="text"
            name="taxRegime"
            value={formData.taxRegime || ''}
            onChange={handleChange}
            placeholder="Ej. Responsable de IVA - Gran Contribuyente Resolución No. 0001"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Leyenda tributaria exigida en comprobantes y facturas electrónicas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Pie de Página y Términos Legales
          </label>
          <textarea
            rows={4}
            name="footerNotes"
            value={formData.footerNotes || ''}
            onChange={handleChange}
            placeholder="Ej. Términos de pago a 30 días. Para transferencias utilizar la cuenta corriente No. 123456789. Esta factura se asimila a una letra de cambio."
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm resize-y"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Texto que se imprimirá al final de presupuestos, órdenes y documentos PDF
          </p>
        </div>
      </div>
    </div>
  );
}

export default LegalTab;
