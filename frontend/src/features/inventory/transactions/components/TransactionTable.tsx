import { useMemo, useState } from 'react';
import { Eye, Ban, Edit2, Calendar, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/shared/components/ui';
import type {
  InventoryTransaction,
  InventoryTransactionType,
  InventoryTransactionStatus,
} from '../types';

export interface TransactionTableProps {
  transactions: InventoryTransaction[];
  isLoading: boolean;
  onViewDetails: (tx: InventoryTransaction) => void;
  onCancelTx: (tx: InventoryTransaction) => void;
  onEdit?: (tx: InventoryTransaction) => void;

  // Ordenamiento
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;

  // Paginación
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  onViewDetails,
  onCancelTx,
  onEdit,
  sortBy: propSortBy,
  sortOrder: propSortOrder,
  onSortChange,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  totalItems: propTotalItems,
  totalPages: propTotalPages,
  onPageChange,
  onPageSizeChange,
}: TransactionTableProps) {
  const isControlledSort = onSortChange !== undefined;
  const isControlledPagination = onPageChange !== undefined;

  const [internalSortBy, setInternalSortBy] = useState<string | null>('movementDate');
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc' | null>('desc');
  const [internalPage, setInternalPage] = useState<number>(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(10);

  const activeSortBy = isControlledSort ? propSortBy : internalSortBy;
  const activeSortOrder = isControlledSort ? propSortOrder : internalSortOrder;
  const activePage = isControlledPagination ? (propCurrentPage ?? 1) : internalPage;
  const activePageSize = isControlledPagination ? (propPageSize ?? 10) : internalPageSize;

  const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
    if (isControlledSort && onSortChange) {
      onSortChange(field, order);
    } else {
      setInternalSortBy(field);
      setInternalSortOrder(order);
    }
  };

  const handlePageChange = (page: number) => {
    if (isControlledPagination && onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isControlledPagination && onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
      setInternalPage(1);
    }
  };

  const processedData = useMemo(() => {
    if (isControlledPagination) {
      return transactions;
    }

    const sorted = [...transactions];
    if (activeSortBy && activeSortOrder) {
      sorted.sort((a, b) => {
        let aVal: any = (a as any)[activeSortBy];
        let bVal: any = (b as any)[activeSortBy];

        if (activeSortBy === 'movementDate') {
          const aTime = new Date(a.movementDate || 0).getTime();
          const bTime = new Date(b.movementDate || 0).getTime();
          return activeSortOrder === 'asc' ? aTime - bTime : bTime - aTime;
        }

        if (activeSortBy === 'reason') {
          aVal = a.reason?.name || '';
          bVal = b.reason?.name || '';
        }

        if (activeSortBy === 'items') {
          const aCount = a.items?.length || 0;
          const bCount = b.items?.length || 0;
          return activeSortOrder === 'asc' ? aCount - bCount : bCount - aCount;
        }

        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        return activeSortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    const start = (activePage - 1) * activePageSize;
    return sorted.slice(start, start + activePageSize);
  }, [transactions, isControlledPagination, activeSortBy, activeSortOrder, activePage, activePageSize]);

  const totalItems = propTotalItems !== undefined ? propTotalItems : transactions.length;
  const totalPages =
    propTotalPages !== undefined
      ? propTotalPages
      : Math.max(1, Math.ceil(totalItems / activePageSize));

  const getTypeBadge = (type: InventoryTransactionType) => {
    switch (type) {
      case 'RECEPTION':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Recepción (+)
          </span>
        );
      case 'ISSUE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            Salida (-)
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            Transferencia
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            Ajuste (+/-)
          </span>
        );
      default:
        return <span className="text-xs">{type}</span>;
    }
  };

  const getStatusBadge = (status: InventoryTransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
            Completada
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-500/20">
            Borrador
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20">
            En Tránsito
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-500/20">
            Anulada
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  const columns: DataTableColumn<InventoryTransaction>[] = useMemo(
    () => [
      {
        key: 'transactionNumber',
        title: 'Nº Transacción',
        sortable: true,
        render: (tx) => (
          <div>
            <span className="font-mono font-semibold text-xs text-[var(--color-sage-600)] block">
              {tx.transactionNumber}
            </span>
            {tx.referenceEntityId && (
              <span className="text-[11px] text-[var(--color-text-muted)] font-mono block">
                Ref: {tx.referenceEntityId}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'movementDate',
        title: 'Fecha',
        sortable: true,
        render: (tx) => {
          const dateStr = tx.movementDate ? tx.movementDate.slice(0, 10) : '—';
          return (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-mono">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {dateStr}
            </span>
          );
        },
      },
      {
        key: 'type',
        title: 'Tipo',
        sortable: true,
        render: (tx) => getTypeBadge(tx.type),
      },
      {
        key: 'originWarehouse',
        title: 'Origen / Destino',
        render: (tx) => {
          if (tx.type === 'TRANSFER') {
            return (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.originWarehouse?.name || 'Origen'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.destWarehouse?.name || 'Destino'}
                </span>
              </div>
            );
          }
          if (tx.originWarehouse) {
            return (
              <span className="text-xs text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-text-muted)]">De: </span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.originWarehouse.name}
                </span>
              </span>
            );
          }
          if (tx.destWarehouse) {
            return (
              <span className="text-xs text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-text-muted)]">Hacia: </span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.destWarehouse.name}
                </span>
              </span>
            );
          }
          return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
        },
      },
      {
        key: 'reason',
        title: 'Motivo',
        sortable: true,
        render: (tx) => (
          <span className="text-xs font-medium text-[var(--color-text-primary)]">
            {tx.reason?.name || '—'}
          </span>
        ),
      },
      {
        key: 'items',
        title: 'Ítems',
        align: 'center',
        sortable: true,
        render: (tx) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-500/10 text-[var(--color-text-secondary)]">
            {tx.items?.length || 0}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Estado',
        align: 'center',
        sortable: true,
        render: (tx) => getStatusBadge(tx.status),
      },
      {
        key: 'actions',
        title: 'Acciones',
        align: 'right',
        render: (tx) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onViewDetails(tx)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-sage-600)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
              title="Ver Detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            {tx.status === 'DRAFT' && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(tx)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-colors"
                title="Editar Borrador"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {tx.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => onCancelTx(tx)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                title="Anular Transacción"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [onViewDetails, onEdit, onCancelTx]
  );

  return (
    <DataTable
      columns={columns}
      data={processedData}
      loading={isLoading}
      loadingMessage="Cargando movimientos de inventario..."
      emptyContent={
        <div className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
            No se encontraron movimientos
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto mb-2">
            No hay registros de transacciones o ninguna coincide con los filtros de búsqueda aplicados.
          </p>
        </div>
      }
      sortBy={activeSortBy}
      sortOrder={activeSortOrder}
      onSortChange={handleSortChange}
      currentPage={activePage}
      pageSize={activePageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      maxPageButtons={10}
    />
  );
}

export default TransactionTable;

