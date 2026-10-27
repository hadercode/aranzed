import {
  Scale,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Binary,
  Box,
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useUnitsOfMeasureContext } from '../../context';
import type { UnitOfMeasure } from '../../types';

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
  } = useUnitsOfMeasureContext();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          No hay unidades de medida registradas
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mt-1 mb-6">
          Comienza creando unidades como Kilogramos (KG), Litros (LT) o Unidades (UND) para asociar a tus productos.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Crear Primera Unidad
        </Button>
      </div>
    );
  }

  if (filteredUoms.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-xs">
        <p className="text-base font-semibold text-[var(--color-text-primary)]">
          No se encontraron unidades de medida
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-4">
          Ninguna unidad coincide con el código, nombre o filtros aplicados.
        </p>
        <Button type="button" variant="secondary" onClick={handleResetFilters}>
          Restablecer Filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)]">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Código
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Nombre de la Unidad
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Manejo de Cantidades
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Estado
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Fecha Registro
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {paginatedUoms.map((uom: UnitOfMeasure) => (
              <tr
                key={uom.id}
                className="hover:bg-[var(--color-surface-bg)]/60 transition-colors group"
              >
                {/* Code Badge */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-mono font-bold tracking-wider bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-700)] dark:text-[var(--color-sage-300)] border border-[var(--color-sage-200)] dark:border-[var(--color-sage-700)]/50">
                    {uom.code}
                  </span>
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-[var(--color-text-primary)]">
                    {uom.name}
                  </div>
                </td>

                {/* Decimals Badge */}
                <td className="px-6 py-4">
                  {uom.allowDecimals ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Binary className="w-3.5 h-3.5 text-blue-500" />
                      Permite Decimales (0.00)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Box className="w-3.5 h-3.5 text-amber-500" />
                      Solo Enteros (1, 2, 3)
                    </span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  {uom.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Inactiva
                    </span>
                  )}
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-xs text-[var(--color-text-secondary)]">
                  {formatDate(uom.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(uom)}
                      className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-sage-600)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                      title={`Editar ${uom.name}`}
                      aria-label={`Editar unidad ${uom.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(uom)}
                      className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      title={`Eliminar ${uom.name}`}
                      aria-label={`Eliminar unidad ${uom.name}`}
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
      <div className="px-6 py-4 bg-[var(--color-surface-bg)] border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <span>Filas por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2">
            Página <strong className="text-[var(--color-text-primary)]">{currentPage}</strong> de{' '}
            <strong className="text-[var(--color-text-primary)]">{totalPages}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UnitsOfMeasureTable;
