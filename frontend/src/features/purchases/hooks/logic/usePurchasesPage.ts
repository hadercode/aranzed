import { useMemo, useCallback, useEffect } from 'react';
import { usePurchasesQuery } from '../queries/usePurchasesQuery';
import { usePurchasesMutations } from '../mutations/usePurchasesMutations';
import { usePurchasesStats } from './usePurchasesStats';
import { usePurchasesStore } from '../../store';
import { useTableUrlSync } from '@/shared/components/ui';
import type { PurchaseStatus } from '../../types';

export function usePurchasesPage() {
  const { data: purchases, loading, error, refetch } = usePurchasesQuery();
  const { updateStatus, deletePurchase, isMutating } = usePurchasesMutations();
  const { stats } = usePurchasesStats(purchases);

  const {
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    completePurchaseTarget,
    deletePurchaseTarget,
    actionFeedback,
    actionError,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    setSort,
    openCompleteModal,
    closeCompleteModal,
    openDeleteModal,
    closeDeleteModal,
    setActionFeedback,
    setActionError,
    clearFeedback,
    clearActionError,
  } = usePurchasesStore();

  // Sincronización bidireccional con Query Params de la URL
  const {
    page: urlPage,
    pageSize: urlPageSize,
    sortBy: urlSortBy,
    sortOrder: urlSortOrder,
    filters: urlFilters,
    setPage: setUrlPage,
    setPageSize: setUrlPageSize,
    setSort: setUrlSort,
    setFilter: setUrlFilter,
  } = useTableUrlSync<{ search?: string; status?: string }>({
    defaultPage: 1,
    defaultPageSize: 10,
    defaultSortBy: 'purchaseDate',
    defaultSortOrder: 'desc',
    defaultFilters: { search: '', status: 'ALL' },
  });

  // Al montar o cambiar la URL, sincronizar store si difiere
  useEffect(() => {
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [urlPage]);

  useEffect(() => {
    if (urlPageSize !== pageSize) {
      setPageSize(urlPageSize);
    }
  }, [urlPageSize]);

  useEffect(() => {
    if (urlSortBy !== sortBy || urlSortOrder !== sortOrder) {
      setSort(urlSortBy, urlSortOrder);
    }
  }, [urlSortBy, urlSortOrder]);

  useEffect(() => {
    if (urlFilters.search !== undefined && urlFilters.search !== searchTerm) {
      setSearchTerm(urlFilters.search);
    }
  }, [urlFilters.search]);

  useEffect(() => {
    if (urlFilters.status && urlFilters.status !== statusFilter) {
      setStatusFilter(urlFilters.status as PurchaseStatus | 'ALL');
    }
  }, [urlFilters.status]);

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchTerm(val);
      setUrlFilter('search', val || null);
    },
    [setSearchTerm, setUrlFilter]
  );

  const handleStatusFilterChange = useCallback(
    (status: PurchaseStatus | 'ALL') => {
      setStatusFilter(status);
      setUrlFilter('status', status === 'ALL' ? null : status);
    },
    [setStatusFilter, setUrlFilter]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setUrlPage(page);
    },
    [setCurrentPage, setUrlPage]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setUrlPageSize(size);
    },
    [setPageSize, setUrlPageSize]
  );

  const handleSortChange = useCallback(
    (key: string, order: 'asc' | 'desc' | null) => {
      setSort(key, order);
      setUrlSort(key, order);
    },
    [setSort, setUrlSort]
  );

  // 1. Filtrado
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSupplier = item.supplierName.toLowerCase().includes(term);
        const matchesNumber = item.purchaseNumber.toLowerCase().includes(term);
        const matchesInvoice = item.invoiceNumber.toLowerCase().includes(term);
        if (!matchesSupplier && !matchesNumber && !matchesInvoice) {
          return false;
        }
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [purchases, searchTerm, statusFilter]);

  // 2. Ordenamiento por columna asc / desc
  const sortedPurchases = useMemo(() => {
    if (!sortBy || !sortOrder) return filteredPurchases;

    return [...filteredPurchases].sort((a, b) => {
      const aVal = (a as any)[sortBy];
      const bVal = (b as any)[sortBy];

      if (sortBy === 'purchaseDate') {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (
        sortBy === 'total' ||
        sortBy === 'subtotal' ||
        sortBy === 'exchangeRate' ||
        sortBy === 'taxAmount'
      ) {
        const aNum = Number(aVal) || 0;
        const bNum = Number(bVal) || 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filteredPurchases, sortBy, sortOrder]);

  // 3. Paginación
  const totalPages = Math.max(1, Math.ceil(sortedPurchases.length / pageSize));

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPurchases.slice(start, start + pageSize);
  }, [sortedPurchases, currentPage, pageSize]);

  const handleConfirmComplete = useCallback(async () => {
    if (!completePurchaseTarget) return;
    try {
      await updateStatus(completePurchaseTarget.id, 'COMPLETED');
      setActionFeedback(
        `Compra #${completePurchaseTarget.purchaseNumber} completada exitosamente. Evento emitido para inventario.`
      );
      closeCompleteModal();
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al completar la compra';
      setActionError(msg);
    }
  }, [
    completePurchaseTarget,
    updateStatus,
    setActionFeedback,
    setActionError,
    closeCompleteModal,
    refetch,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletePurchaseTarget) return;
    try {
      await deletePurchase(deletePurchaseTarget.id);
      setActionFeedback(`Compra #${deletePurchaseTarget.purchaseNumber} eliminada correctamente.`);
      closeDeleteModal();
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la compra';
      setActionError(msg);
    }
  }, [
    deletePurchaseTarget,
    deletePurchase,
    setActionFeedback,
    setActionError,
    closeDeleteModal,
    refetch,
  ]);

  return {
    purchases,
    loading,
    error,
    refetch,
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    setPageSize,
    setSort,
    totalPages,
    filteredPurchases,
    paginatedPurchases,
    handleSearchChange,
    handleStatusFilterChange,
    setCurrentPage,
    stats,
    completePurchaseTarget,
    deletePurchaseTarget,
    actionFeedback,
    actionError,
    openCompleteModal,
    closeCompleteModal,
    handleConfirmComplete,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    clearFeedback,
    clearActionError,
    isMutating,
  };
}

export type UsePurchasesPageReturn = ReturnType<typeof usePurchasesPage>;
