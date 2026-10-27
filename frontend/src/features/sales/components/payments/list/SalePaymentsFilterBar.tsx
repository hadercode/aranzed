import { Search, X } from 'lucide-react';
import type { PaymentMethod, PaymentStatus } from '../../../types';

export interface SalePaymentsFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  methodFilter: PaymentMethod | 'ALL';
  onMethodChange: (val: PaymentMethod | 'ALL') => void;
  statusFilter: PaymentStatus | 'ALL';
  onStatusChange: (val: PaymentStatus | 'ALL') => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onClearFilters: () => void;
}

export function SalePaymentsFilterBar({
  searchTerm,
  onSearchChange,
  methodFilter,
  onMethodChange,
  statusFilter,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
}: SalePaymentsFilterBarProps) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    methodFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 border border-[var(--color-border)] shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Buscar por cliente, documento o referencia bancaria..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        {/* Filtro Método */}
        <div className="w-full md:w-48">
          <select
            value={methodFilter}
            onChange={(e) =>
              onMethodChange(e.target.value as PaymentMethod | 'ALL')
            }
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          >
            <option value="ALL">Todos los métodos</option>
            <option value="CASH_USD">Efectivo ($)</option>
            <option value="CASH_VES">Efectivo (Bs)</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="MOBILE_PAY">Pago Móvil</option>
            <option value="POS">Punto de Venta</option>
            <option value="ZELLE">Zelle</option>
            <option value="CARD">Tarjeta</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        {/* Filtro Estado */}
        <div className="w-full md:w-44">
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as PaymentStatus | 'ALL')
            }
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="CONFIRMED">Aplicados (Confirmados)</option>
            <option value="CANCELLED">Anulados</option>
          </select>
        </div>
      </div>

      {/* Rango de Fechas */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
        <span className="font-medium">Rango de Fechas:</span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none"
          />
          <span>hasta</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 ml-auto text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
