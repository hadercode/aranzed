import { useNavigate } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import { Button, DataTable } from '@/shared/components/ui';
import { useProductsStore } from '../../store';
import { useProductsQuery, useProductsFilters, useProductsTableColumns } from '../../hooks';
import type { Product } from '../../types';

export function ProductsTable() {
  const navigate = useNavigate();
  const { data: products, loading } = useProductsQuery();
  const {
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    setCurrentPage,
    setItemsPerPage,
  } = useProductsStore();

  const {
    paginatedProducts,
    filteredProducts,
    totalPages,
    handleSortChange,
  } = useProductsFilters({ products });

  const columns = useProductsTableColumns();

  return (
    <DataTable<Product>
      columns={columns}
      data={paginatedProducts}
      loading={loading && products.length === 0}
      loadingMessage="Cargando catálogo de productos..."
      emptyContent={
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mx-auto flex items-center justify-center mb-4 border border-[var(--color-sage-500)]/20">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            {products.length === 0
              ? 'No hay productos en el catálogo'
              : 'No se encontraron productos'}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
            {products.length === 0
              ? 'Comienza creando productos comerciales, insumos de producción o servicios con sus unidades de medida y márgenes.'
              : 'No se encontraron productos que coincidan con los filtros de búsqueda aplicados.'}
          </p>
          {products.length === 0 && (
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/catalog/products/new')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Crear Primer Producto
            </Button>
          )}
        </div>
      }
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={itemsPerPage}
      totalItems={filteredProducts.length}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      maxPageButtons={10}
    />
  );
}

export default ProductsTable;
