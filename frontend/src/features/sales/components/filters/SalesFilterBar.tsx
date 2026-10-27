import { Search, X, RotateCcw } from 'lucide-react';
import { useSalesContext } from '../../context';
import type { SalePaidStatus, SalePaymentTerm, SaleStatus, SaleType } from '../../types';

export function SalesFilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    paymentTermFilter,
    setPaymentTermFilter,
    paidStatusFilter,
    setPaidStatusFilter,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useSalesContext();

  const hasActiveFilters =
    Boolean(searchTerm) ||
    typeFilter !== 'ALL' ||
    paymentTermFilter !== 'ALL' ||
    paidStatusFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    Boolean(startDate) ||
    Boolean(endDate);

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setPaymentTermFilter('ALL');
    setPaidStatusFilter('ALL');
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 shadow-[var(--shadow-organic)] border border-[var(--color-border)] mb-6 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {/* Búsqueda rápida */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por correlativo, cliente, RIF o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/20 focus:border-[var(--color-sage-500)]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tipo de Documento */}
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

        {/* Condición (Contado vs Crédito) */}
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

        {/* Estado de Pago */}
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

        {/* Estado del Documento */}
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

        {/* Fechas / Reset */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Desde"
            className="w-1/2 px-1.5 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-sage-500)]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="Hasta"
            className="w-1/2 px-1.5 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-sage-500)]"
          />
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
              title="Limpiar todos los filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesFilterBar;
