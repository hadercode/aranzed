import { ScrollText } from 'lucide-react';
import { useRecipesContext } from '../../context';
import { useRecipesTableColumns } from '../../hooks/logic/useRecipesTableColumns';
import { DataTable, Button } from '@/shared/components/ui';

export function RecipesTable() {
  const {
    recipes,
    totalRecipes,
    loading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    sortBy,
    sortOrder,
    handleSortChange,
    handleCreateNew,
  } = useRecipesContext();

  const columns = useRecipesTableColumns();

  if (error) {
    return (
      <div className="alert-danger rounded-2xl p-6 text-center shadow-xs">
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={recipes}
      loading={loading}
      loadingMessage="Cargando recetas de fabricación..."
      emptyContent={
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] text-[var(--color-text-muted)] mb-4 border border-[var(--color-border)]">
            <ScrollText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            No se encontraron recetas
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">
            No hay recetas registradas que coincidan con los filtros aplicados.
          </p>
          <Button variant="primary" onClick={handleCreateNew}>
            Crear Primera Receta
          </Button>
        </div>
      }
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={itemsPerPage}
      totalItems={totalRecipes}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      maxPageButtons={10}
    />
  );
}

export default RecipesTable;
