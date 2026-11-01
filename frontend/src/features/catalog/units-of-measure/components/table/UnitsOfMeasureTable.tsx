import { Scale, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useUnitsOfMeasurePage } from '../../hooks';
import { UnitsOfMeasureTableRow } from './UnitsOfMeasureTableRow';
import { UnitsOfMeasureTablePagination } from './UnitsOfMeasureTablePagination';

export function UnitsOfMeasureTable() {
  const {
    loading,
    paginatedUoms,
    filteredUoms,
    uoms,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    handleItemsPerPageChange,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenCreate,
    handleResetFilters,
  } = useUnitsOfMeasurePage();

  if (loading && uoms.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <Scale className="w-10 h-10 animate-pulse mx-auto text-[var(--color-sage-500)] mb-3 opacity-60" />
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          Cargando unidades de medida...
        </p>
      </div>
    );
  }

  if (uoms.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mx-auto flex items-center justify-center mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          Sin unidades de medida
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto mt-1 mb-6">
          Comienza configurando las unidades métricas para tus compras, recetas y existencias.
        </p>
        <Button variant="primary" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Crear Primera Unidad
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
              <th className="px-6 py-3.5 font-semibold">Código</th>
              <th className="px-6 py-3.5 font-semibold">Nombre</th>
              <th className="px-6 py-3.5 font-semibold">Símbolo</th>
              <th className="px-6 py-3.5 font-semibold">Aritmética</th>
              <th className="px-6 py-3.5 font-semibold">Estado</th>
              <th className="px-6 py-3.5 font-semibold">Fecha Creación</th>
              <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filteredUoms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-xs text-[var(--color-text-secondary)]">
                  No se encontraron unidades de medida que coincidan con la búsqueda.
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
              paginatedUoms.map((uom) => (
                <UnitsOfMeasureTableRow
                  key={uom.id}
                  uom={uom}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <UnitsOfMeasureTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredCount={filteredUoms.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}

export default UnitsOfMeasureTable;
