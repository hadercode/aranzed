import { Search, X, RotateCcw, Filter, Binary } from 'lucide-react';
import { useUnitsOfMeasureContext } from '../../context';
import type { UomStatusFilter, UomDecimalsFilter } from '../../types';

export interface UnitsOfMeasureFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: UomStatusFilter;
  onStatusFilterChange?: (val: UomStatusFilter) => void;
  decimalsFilter?: UomDecimalsFilter;
  onDecimalsFilterChange?: (val: UomDecimalsFilter) => void;
  onResetFilters?: () => void;
}

export function UnitsOfMeasureFilterBar({
  searchTerm: propSearchTerm,
  onSearchChange: propOnSearchChange,
  statusFilter: propStatusFilter,
  onStatusFilterChange: propOnStatusFilterChange,
  decimalsFilter: propDecimalsFilter,
  onDecimalsFilterChange: propOnDecimalsFilterChange,
  onResetFilters: propOnResetFilters,
}: UnitsOfMeasureFilterBarProps) {
  const context = useUnitsOfMeasureContext();

  const searchTerm = propSearchTerm ?? context.searchTerm;
  const onSearchChange = propOnSearchChange ?? context.handleSearchChange;

  const statusFilter = propStatusFilter ?? context.statusFilter;
  const onStatusFilterChange = propOnStatusFilterChange ?? context.handleStatusFilterChange;

  const decimalsFilter = propDecimalsFilter ?? context.decimalsFilter;
  const onDecimalsFilterChange = propOnDecimalsFilterChange ?? context.handleDecimalsFilterChange;

  const onResetFilters = propOnResetFilters ?? context.handleResetFilters;

  const isFiltered = searchTerm !== '' || statusFilter !== 'all' || decimalsFilter !== 'all';

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código (ej. KG, LT) o nombre de la unidad..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as UomStatusFilter)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activas</option>
              <option value="inactive">Solo Inactivas</option>
            </select>
          </div>

          {/* Decimals Dropdown */}
          <div className="flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={decimalsFilter}
              onChange={(e) => onDecimalsFilterChange(e.target.value as UomDecimalsFilter)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="all">Todos los tipos de cantidad</option>
              <option value="decimals">Permite Decimales</option>
              <option value="integers">Solo Enteros</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Result Counter */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] pt-1 border-t border-[var(--color-border)]/50">
        <span>
          Mostrando <strong className="text-[var(--color-text-primary)]">{context.filteredUoms.length}</strong> de{' '}
          <strong className="text-[var(--color-text-primary)]">{context.uoms.length}</strong> unidades
        </span>
        {isFiltered && (
          <span className="italic text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
            Filtros aplicados
          </span>
        )}
      </div>
    </div>
  );
}

export default UnitsOfMeasureFilterBar;
