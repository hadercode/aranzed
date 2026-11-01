import type { SalePaidStatus, SalePaymentTerm, SaleStatus, SaleType } from '../../types';

export interface SalesFilterSelectsProps {
  typeFilter: SaleType | 'ALL';
  setTypeFilter: (val: SaleType | 'ALL') => void;
  paymentTermFilter: SalePaymentTerm | 'ALL';
  setPaymentTermFilter: (val: SalePaymentTerm | 'ALL') => void;
  paidStatusFilter: SalePaidStatus | 'ALL';
  setPaidStatusFilter: (val: SalePaidStatus | 'ALL') => void;
  statusFilter: SaleStatus | 'ALL';
  setStatusFilter: (val: SaleStatus | 'ALL') => void;
}

export function SalesFilterSelects({
  typeFilter,
  setTypeFilter,
  paymentTermFilter,
  setPaymentTermFilter,
  paidStatusFilter,
  setPaidStatusFilter,
  statusFilter,
  setStatusFilter,
}: SalesFilterSelectsProps) {
  return (
    <>
      <div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as SaleType | 'ALL')}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/20 focus:border-[var(--color-sage-500)]"
        >
          <option value="ALL">Tipo: Todos</option>
          <option value="DIRECT_SALE">Ventas Directas</option>
          <option value="QUOTATION">Cotizaciones</option>
        </select>
      </div>

      <div>
        <select
          value={paymentTermFilter}
          onChange={(e) => setPaymentTermFilter(e.target.value as SalePaymentTerm | 'ALL')}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/20 focus:border-[var(--color-sage-500)]"
        >
          <option value="ALL">Condición: Todas</option>
          <option value="CONTADO">Contado</option>
          <option value="CREDITO">Crédito</option>
        </select>
      </div>

      <div>
        <select
          value={paidStatusFilter}
          onChange={(e) => setPaidStatusFilter(e.target.value as SalePaidStatus | 'ALL')}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/20 focus:border-[var(--color-sage-500)]"
        >
          <option value="ALL">Pago: Todos</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="ABONADO">Abonados</option>
          <option value="PAGADO">Pagados</option>
        </select>
      </div>

      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SaleStatus | 'ALL')}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/20 focus:border-[var(--color-sage-500)]"
        >
          <option value="ALL">Doc: Todos</option>
          <option value="COMPLETED">Completadas</option>
          <option value="DRAFT">Borrador</option>
          <option value="CANCELLED">Anuladas</option>
        </select>
      </div>
    </>
  );
}

