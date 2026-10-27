import React, { useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Loader2,
} from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  title: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  sortKey?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  emptyContent?: React.ReactNode;
  rowKey?: (item: T, index: number) => string | number;
  className?: string;

  // Ordenamiento
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;

  // Paginación
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
  maxPageButtons?: number;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  loadingMessage = 'Cargando información...',
  emptyMessage = 'No se encontraron resultados',
  emptyContent,
  rowKey = (item: any, i) => item?.id ?? item?._id ?? i,
  className = '',

  // Ordenamiento
  sortBy,
  sortOrder,
  onSortChange,

  // Paginación
  currentPage = 1,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  totalItems,
  totalPages: propTotalPages,
  onPageChange,
  onPageSizeChange,
  showPagination = true,
  maxPageButtons = 10,
}: DataTableProps<T>) {
  // Cálculo de totalPages si no se envía directamente
  const calculatedTotalPages = useMemo(() => {
    if (propTotalPages !== undefined) return Math.max(1, propTotalPages);
    const count = totalItems !== undefined ? totalItems : data.length;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [propTotalPages, totalItems, data.length, pageSize]);

  // Cantidad total real de items para el texto "Mostrando X a Y de Z"
  const countItems = totalItems !== undefined ? totalItems : data.length;
  const startItem = countItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(countItems, currentPage * pageSize);

  // Manejo de clic en cabecera de ordenamiento
  const handleHeaderClick = (col: DataTableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;

    const key = col.sortKey || col.key;
    if (sortBy !== key) {
      onSortChange(key, 'asc');
    } else if (sortOrder === 'asc') {
      onSortChange(key, 'desc');
    } else {
      onSortChange(key, null);
    }
  };

  // Generador de números de página visibles (hasta maxPageButtons = 10 páginas)
  const pageNumbers = useMemo(() => {
    if (calculatedTotalPages <= maxPageButtons) {
      return Array.from({ length: calculatedTotalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = start + maxPageButtons - 1;

    if (end > calculatedTotalPages) {
      end = calculatedTotalPages;
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, calculatedTotalPages, maxPageButtons]);

  return (
    <div
      className={`bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Contenedor responsivo con scroll horizontal */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)] text-xs uppercase font-semibold tracking-wider">
              {columns.map((col) => {
                const isCurrentSort = (col.sortKey || col.key) === sortBy;
                const canSort = Boolean(col.sortable && onSortChange);

                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => handleHeaderClick(col)}
                    className={`px-4 py-3.5 transition-colors select-none ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${
                      canSort
                        ? 'cursor-pointer hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-card)]/50 group'
                        : ''
                    } ${col.headerClassName || ''}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right'
                          ? 'justify-end'
                          : col.align === 'center'
                          ? 'justify-center'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.title}</span>

                      {canSort && (
                        <span className="inline-flex items-center text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {isCurrentSort ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold" />
                            ) : sortOrder === 'desc' ? (
                              <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold" />
                            ) : (
                              <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-80" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-primary)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {loadingMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyContent ? (
                    emptyContent
                  ) : (
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center py-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-bg)] text-[var(--color-text-muted)] flex items-center justify-center mb-3 border border-[var(--color-border)]">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                        {emptyMessage}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Intenta ajustar los criterios de búsqueda o filtros aplicados.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const key = rowKey(item, index);

                return (
                  <tr
                    key={key}
                    className="hover:bg-[var(--color-surface-bg)]/60 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 align-middle ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render ? col.render(item, index) : (item as any)?.[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Barra de Paginación */}
      {showPagination && !loading && countItems > 0 && (
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-bg)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
          {/* Lado Izquierdo: Selector de registros por página y rango */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Registros por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                  aria-label="Registros por página"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <span className="text-[var(--color-text-muted)]">
              Mostrando{' '}
              <strong className="text-[var(--color-text-primary)] font-semibold">
                {startItem}
              </strong>{' '}
              a{' '}
              <strong className="text-[var(--color-text-primary)] font-semibold">
                {endItem}
              </strong>{' '}
              de{' '}
              <strong className="text-[var(--color-text-primary)] font-semibold">
                {countItems}
              </strong>{' '}
              registros
            </span>
          </div>

          {/* Lado Derecho: Controles numéricos y navegación de páginas */}
          {calculatedTotalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1">
              {/* Botón Primera Página (<<) */}
              {pageNumbers[0] > 1 && (
                <button
                  type="button"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Primera página"
                  aria-label="Primera página"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
              )}

              {/* Botón Anterior (<) */}
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Botones Numéricos de Páginas (Hasta 10 páginas directas) */}
              <div className="flex items-center gap-1 overflow-x-auto px-0.5">
                {pageNumbers.map((p) => {
                  const isActive = p === currentPage;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPageChange(p)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                          : 'border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente (>) */}
              <button
                type="button"
                onClick={() => onPageChange(Math.min(calculatedTotalPages, currentPage + 1))}
                disabled={currentPage >= calculatedTotalPages}
                className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Botón Última Página (>>) */}
              {pageNumbers[pageNumbers.length - 1] < calculatedTotalPages && (
                <button
                  type="button"
                  onClick={() => onPageChange(calculatedTotalPages)}
                  disabled={currentPage >= calculatedTotalPages}
                  className="p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Última página"
                  aria-label="Última página"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
