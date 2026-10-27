import { User, Search, CheckCircle2 } from 'lucide-react';

export interface CustomerSelectSectionProps {
  customerName: string;
  onCustomerNameChange: (val: string) => void;
  customerTaxId: string;
  onCustomerTaxIdChange: (val: string) => void;
  pendingSalesCount: number;
  isLoadingPending: boolean;
}

export function CustomerSelectSection({
  customerName,
  onCustomerNameChange,
  customerTaxId,
  onCustomerTaxIdChange,
  pendingSalesCount,
  isLoadingPending,
}: CustomerSelectSectionProps) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Cliente y Documento
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Filtra las ventas pendientes por nombre o razón social
            </p>
          </div>
        </div>

        {customerName.trim() && (
          <div className="text-right">
            {isLoadingPending ? (
              <span className="text-xs text-[var(--color-text-muted)] italic">
                Buscando facturas...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-sage-500/10 text-sage-600 dark:text-sage-400 border border-sage-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {pendingSalesCount} {pendingSalesCount === 1 ? 'factura pendiente' : 'facturas pendientes'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre o Razón Social */}
        <div className="space-y-1.5">
          <label
            htmlFor="customer-name-input"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Nombre o Razón Social del Cliente
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              id="customer-name-input"
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Ej: Inversiones Los Andes, Juan Pérez..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Escribe para cargar automáticamente todas sus facturas por cobrar.
          </p>
        </div>

        {/* Cédula o RIF */}
        <div className="space-y-1.5">
          <label
            htmlFor="customer-tax-id-input"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Cédula / RIF (Opcional)
          </label>
          <input
            id="customer-tax-id-input"
            type="text"
            value={customerTaxId}
            onChange={(e) => onCustomerTaxIdChange(e.target.value)}
            placeholder="Ej: J-12345678-9, V-12345678"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Identificación fiscal del pagador para fines de auditoría.
          </p>
        </div>
      </div>
    </div>
  );
}
