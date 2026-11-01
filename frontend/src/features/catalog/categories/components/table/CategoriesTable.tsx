import { FolderTree, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useCategoriesPage } from '../../hooks';
import { CategoriesTableRow } from './CategoriesTableRow';
import { CategoriesTablePagination } from './CategoriesTablePagination';

export function CategoriesTable() {
  const {
    loading,
    paginatedCategories,
    filteredCategories,
    categories,
    categoryMap,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    handleItemsPerPageChange,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenCreate,
    handleResetFilters,
  } = useCategoriesPage();

  if (loading && categories.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <FolderTree className="w-10 h-10 animate-pulse mx-auto text-[var(--color-sage-500)] mb-3 opacity-60" />
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          Cargando categorías del catálogo...
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <FolderTree className="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-3 opacity-40" />
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          Sin categorías registradas
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto mt-1 mb-6">
          Comienza organizando tu catálogo creando tu primera categoría o familia de productos.
        </p>
        <Button variant="primary" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Crear Primera Categoría
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] uppercase">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Categoría</th>
              <th className="px-6 py-3.5 font-semibold">Jerarquía</th>
              <th className="px-6 py-3.5 font-semibold">Estado</th>
              <th className="px-6 py-3.5 font-semibold">Fecha Creación</th>
              <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-[var(--color-text-secondary)]">
                  No se encontraron categorías que coincidan con la búsqueda.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-semibold text-[var(--color-sage-600)] hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <CategoriesTableRow
                  key={cat.id}
                  category={cat}
                  parentName={cat.parentId ? categoryMap.get(cat.parentId)?.name : undefined}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoriesTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredCount={filteredCategories.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}

export default CategoriesTable;
