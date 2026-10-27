import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { useCategoriesContext } from '../../context';
import type { CategoryStatusFilter } from '../../types';

export interface CategoriesFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: CategoryStatusFilter;
  onStatusFilterChange?: (val: CategoryStatusFilter) => void;
  parentFilter?: string;
  onParentFilterChange?: (val: string) => void;
  onResetFilters?: () => void;
}

export function CategoriesFilterBar({
  searchTerm: propSearchTerm,
  onSearchChange: propOnSearchChange,
  statusFilter: propStatusFilter,
  onStatusFilterChange: propOnStatusFilterChange,
  parentFilter: propParentFilter,
  onParentFilterChange: propOnParentFilterChange,
  onResetFilters: propOnResetFilters,
}: CategoriesFilterBarProps) {
  const context = useCategoriesContext();

  const searchTerm = propSearchTerm ?? context.searchTerm;
  const onSearchChange = propOnSearchChange ?? context.handleSearchChange;

  const statusFilter = propStatusFilter ?? context.statusFilter;
  const onStatusFilterChange = propOnStatusFilterChange ?? context.handleStatusFilterChange;

  const parentFilter = propParentFilter ?? context.parentFilter;
  const onParentFilterChange = propOnParentFilterChange ?? context.handleParentFilterChange;

  const onResetFilters = propOnResetFilters ?? context.handleResetFilters;

  const rootCategories = context.categories.filter((c) => !c.parentId);
  const isFiltered = searchTerm !== '' || statusFilter !== 'all' || parentFilter !== 'all';

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
            placeholder="Buscar por nombre o ruta de categoría..."
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
              onChange={(e) => onStatusFilterChange(e.target.value as CategoryStatusFilter)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activas</option>
              <option value="inactive">Solo Inactivas</option>
            </select>
          </div>

          {/* Hierarchy Level / Parent Dropdown */}
          <select
            value={parentFilter}
            onChange={(e) => onParentFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer max-w-[200px] truncate"
          >
            <option value="all">Todos los niveles</option>
            <option value="root">Solo Raíz (Nivel Principal)</option>
            {rootCategories.map((root) => (
              <option key={root.id} value={root.id}>
                Hijas de: {root.name}
              </option>
            ))}
          </select>

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
          Mostrando <strong className="text-[var(--color-text-primary)]">{context.filteredCategories.length}</strong> de{' '}
          <strong className="text-[var(--color-text-primary)]">{context.categories.length}</strong> categorías
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

export default CategoriesFilterBar;
