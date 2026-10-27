import { Search, X, RotateCcw, Filter, FolderTree, Scale } from 'lucide-react';
import { useProductsContext } from '../../context';
import type { ProductTypeFilter, ProductStatusFilter } from '../../types';

export function ProductsFilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    uomFilter,
    setUomFilter,
    resetFilters,
    filteredProducts,
    products,
    categories,
    uoms,
  } = useProductsContext();

  const isFiltered =
    searchTerm !== '' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    uomFilter !== 'all';

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, descripción, categoría o código de unidad..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProductTypeFilter)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="TRADITIONAL">Tradicional</option>
              <option value="RAW_MATERIAL">Materia Prima</option>
              <option value="FINISHED_GOOD">Terminado</option>
              <option value="SERVICE">Servicio</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer max-w-[170px] truncate"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* UoM Dropdown */}
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={uomFilter}
              onChange={(e) => setUomFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer max-w-[150px] truncate"
            >
              <option value="all">Todas las unidades</option>
              {uoms.map((uom) => (
                <option key={uom.id} value={uom.id}>
                  {uom.code} - {uom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatusFilter)}
              className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
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
          Mostrando <strong className="text-[var(--color-text-primary)]">{filteredProducts.length}</strong> de{' '}
          <strong className="text-[var(--color-text-primary)]">{products.length}</strong> productos y servicios
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

export default ProductsFilterBar;
