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
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
              Cliente y Documento
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Filtra las ventas pendientes por nombre o razón social del cliente
            </p>
          </div>
        </div>

        {customerName.trim() && (
          <div className="text-left sm:text-right">
            {isLoadingPending ? (
              <span className="text-xs text-[var(--color-text-muted)] italic animate-pulse">
                Buscando facturas pendientes...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-sage-500/10 text-sage-600 dark:text-sage-400 border border-sage-500/20">
                <CheckCircle2 className="w-4 h-4" />
                {pendingSalesCount} {pendingSalesCount === 1 ? 'factura pendiente' : 'facturas pendientes'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Nombre o Razón Social */}
        <div className="space-y-1.5">
          <label
            htmlFor="customer-name-input"
            className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] block"
          >
            Nombre o Razón Social del Cliente
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              id="customer-name-input"
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Ej: Inversiones Los Andes, Juan Pérez..."
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
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
            className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] block"
          >
            Cédula / RIF (Opcional)
          </label>
          <input
            id="customer-tax-id-input"
            type="text"
            value={customerTaxId}
            onChange={(e) => onCustomerTaxIdChange(e.target.value)}
            placeholder="Ej: J-12345678-9, V-12345678"
            className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
          />
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Identificación fiscal del pagador para fines de auditoría.
          </p>
        </div>
      </div>
    </div>
  );
}
