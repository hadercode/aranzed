import { useMemo } from 'react';
import { useTableUrlSync } from '@/shared/components/ui';
import { useTransactionsQuery } from '../queries/useTransactionsQuery';
import { useWarehousesQuery } from '../../../warehouses/hooks';
import type {
  InventoryTransactionType,
  InventoryTransactionStatus,
  TransactionFilters,
} from '../../types';

export interface TransactionsTableFilters {
  search?: string;
  type?: string;
  status?: string;
  warehouseId?: string;
}

export interface TransactionsStatsSummary {
  totalCount: number;
  completedCount: number;
  draftCount: number;
  receptionCount: number;
  issueCount: number;
  transferCount: number;
}

export function useTransactionsTableData() {
  // 1. Sincronización completa y reactiva con URL (query params)
  const {
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetAll,
  } = useTableUrlSync<TransactionsTableFilters>({
    defaultPage: 1,
    defaultPageSize: 10,
    defaultSortBy: 'movementDate',
    defaultSortOrder: 'desc',
    defaultFilters: {
      search: '',
      type: '',
      status: '',
      warehouseId: '',
    },
  });

  const searchTerm = filters.search || '';
  const typeFilter = filters.type || '';
  const statusFilter = filters.status || '';
  const warehouseFilter = filters.warehouseId || '';

  const { warehouses } = useWarehousesQuery();

  // 2. Parámetros remotos derivados de la URL para el servidor
  const queryFilters = useMemo<TransactionFilters>(
    () => ({
      page,
      limit: pageSize,
      sortBy: sortBy || 'movementDate',
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
      type: (typeFilter as InventoryTransactionType) || undefined,
      status: (statusFilter as InventoryTransactionStatus) || undefined,
      warehouseId: warehouseFilter || undefined,
      search: searchTerm.trim() ? searchTerm.trim() : undefined,
    }),
    [page, pageSize, sortBy, sortOrder, typeFilter, statusFilter, warehouseFilter, searchTerm],
  );

  // 3. Consulta remota mediante React Query (server-side pagination, sorting y filtering)
  const {
    transactions,
    total,
    totalPages,
    isLoading,
    updateTransaction,
  } = useTransactionsQuery(queryFilters);

  // 4. Métricas estadísticas calculadas a partir del total y la página actual
  const stats: TransactionsStatsSummary = useMemo(() => {
    let completed = 0;
    let draft = 0;
    let reception = 0;
    let issue = 0;
    let transfer = 0;

    for (const tx of transactions) {
      if (tx.status === 'COMPLETED') completed++;
      if (tx.status === 'DRAFT' || tx.status === 'IN_TRANSIT') draft++;
      if (tx.type === 'RECEPTION') reception++;
      if (tx.type === 'ISSUE') issue++;
      if (tx.type === 'TRANSFER') transfer++;
    }

    return {
      totalCount: total,
      completedCount: completed,
      draftCount: draft,
      receptionCount: reception,
      issueCount: issue,
      transferCount: transfer,
    };
  }, [transactions, total]);

  return {
    // Datos remotos para el DataTable
    transactions,
    isLoading,
    stats,
    warehouses,

    // Filtros activos sincronizados en URL
    searchTerm,
    typeFilter,
    statusFilter,
    warehouseFilter,

    // Paginación y ordenamiento remotos
    page,
    pageSize,
    totalItems: total,
    totalPages,
    sortBy,
    sortOrder,

    // Mutadores que actualizan la URL automáticamente y disparan el query remoto
    setPage,
    setPageSize,
    setSort,
    setSearch: (val: string) => setFilter('search', val),
    setTypeFilter: (val: string) => setFilter('type', val),
    setStatusFilter: (val: string) => setFilter('status', val),
    setWarehouseFilter: (val: string) => setFilter('warehouseId', val),
    resetFilters: resetAll,

    // Mutaciones de datos
    updateTransaction,
  };
}

export type UseTransactionsTableDataReturn = ReturnType<typeof useTransactionsTableData>;
