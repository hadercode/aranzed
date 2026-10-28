import { useNavigate } from 'react-router-dom';
import {
  Package,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingBag,
  Boxes,
  Layers,
  Wrench,
  Percent,
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getAssetUrl } from '@/lib/api-client';
import { useProductsContext } from '../../context';
import type { Product, ProductType } from '../../types';

export function ProductsTable() {
  const navigate = useNavigate();
  const {
    loading,
    paginatedProducts,
    filteredProducts,
    products,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    openDeleteConfirm,
    resetFilters,
  } = useProductsContext();

  const getTypeBadge = (type: ProductType) => {
    switch (type) {
      case 'TRADITIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            <ShoppingBag className="w-3 h-3" />
            Tradicional
          </span>
        );
      case 'RAW_MATERIAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            <Boxes className="w-3 h-3" />
            Materia Prima
          </span>
        );
      case 'FINISHED_GOOD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            <Layers className="w-3 h-3" />
            Terminado
          </span>
        );
      case 'SERVICE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            <Wrench className="w-3 h-3" />
            Servicio
          </span>
        );
      default:
        return null;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <Package className="w-10 h-10 animate-pulse mx-auto text-[var(--color-sage-500)] mb-3 opacity-60" />
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          Cargando catálogo de productos...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mx-auto flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          No hay productos en el catálogo
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mt-1 mb-6">
          Comienza creando productos comerciales, bienes manufacturados o servicios profesionales con sus unidades de medida y márgenes.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate('/catalog/products/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Crear Primer Producto
        </Button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
          No se encontraron productos que coincidan con los filtros aplicados.
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
          Restablecer Filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-bg)]/50 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th className="py-3.5 px-4">Producto</th>
              <th className="py-3.5 px-4">Tipo</th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Unidad</th>
              <th className="py-3.5 px-4 text-right">Último Costo</th>
              <th className="py-3.5 px-4 text-center">Margen</th>
              <th className="py-3.5 px-4 text-right">Precio Venta</th>
              <th className="py-3.5 px-4 text-center">Estado</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {paginatedProducts.map((product: Product) => (
              <tr
                key={product.id}
                className="hover:bg-[var(--color-surface-bg)]/40 transition-colors group"
              >
                {/* Product Name & Image */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img
                        src={getAssetUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-bg)]"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-sage-600)] transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 max-w-xs">
                      <div className="font-semibold text-[var(--color-text-primary)] truncate">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getTypeBadge(product.type)}
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {product.category?.name ? (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)] italic">
                      Sin categoría
                    </span>
                  )}
                </td>

                {/* UoM */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {product.uom ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-700)] dark:text-[var(--color-sage-300)]">
                        {product.uom.code}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {product.uom.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">—</span>
                  )}
                </td>

                {/* Last Cost */}
                <td className="py-3.5 px-4 text-right font-mono text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  ${Number(product.lastCost || 0).toFixed(2)}
                </td>

                {/* Profit Margin */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5 font-semibold text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    <Percent className="w-2.5 h-2.5" />
                    {Number(product.profitMargin || 0).toFixed(1)}%
                  </span>
                </td>

                {/* Last Sale Price */}
                <td className="py-3.5 px-4 text-right font-mono text-sm font-bold text-[var(--color-text-primary)] whitespace-nowrap">
                  ${Number(product.lastSalePrice || 0).toFixed(2)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    {product.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                        Inactivo
                      </span>
                    )}
                    {product.manageInventory !== false ? (
                      <span className="text-[10px] text-[var(--color-sage-600)] font-medium">
                        Controla stock
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        Sin inventario
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/catalog/products/${product.id}/edit`)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-sage-600)] hover:bg-[var(--color-surface-bg)] transition-colors cursor-pointer"
                      title="Editar producto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteConfirm(product)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <span>Elementos por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Página <strong className="text-[var(--color-text-primary)]">{currentPage}</strong> de{' '}
            <strong className="text-[var(--color-text-primary)]">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;
