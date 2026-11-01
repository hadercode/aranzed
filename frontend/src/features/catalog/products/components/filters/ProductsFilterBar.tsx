import { Search, X } from 'lucide-react';
import { useProductsStore } from '../../store';
import { useProductsQuery, useProductsFilters } from '../../hooks';
import { ProductFilterSelects } from './ProductFilterSelects';

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
  } = useProductsStore();

  const { data: products, categories, uoms } = useProductsQuery();
  const { filteredProducts } = useProductsFilters({ products });

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
        <ProductFilterSelects
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          uomFilter={uomFilter}
          setUomFilter={setUomFilter}
          uoms={uoms}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isFiltered={isFiltered}
          resetFilters={resetFilters}
        />
      </div>

      {/* Filter result feedback */}
      {isFiltered && (
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] px-1 pt-1 border-t border-[var(--color-border)]/50">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] hover:underline font-medium"
          >
            Quitar todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsFilterBar;
