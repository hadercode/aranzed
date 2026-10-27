import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { useRecipesContext } from '../../context';
import type { RecipeStatus } from '../../types';

export function RecipesFilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    totalRecipes,
    rawRecipesCount,
    setCurrentPage,
  } = useRecipesContext();

  const isFiltered = searchTerm !== '' || statusFilter !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por código, nombre o producto fabricado..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as RecipeStatus | 'ALL');
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activas</option>
              <option value="DRAFT">Borradores</option>
              <option value="INACTIVE">Inactivas</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
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
          Mostrando <strong className="text-[var(--color-text-primary)]">{totalRecipes}</strong> de{' '}
          <strong className="text-[var(--color-text-primary)]">{rawRecipesCount}</strong> recetas
        </span>
      </div>
    </div>
  );
}
