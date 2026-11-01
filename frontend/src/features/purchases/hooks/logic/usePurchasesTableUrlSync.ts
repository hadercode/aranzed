import { useEffect, useCallback } from 'react';
import { useTableUrlSync } from '@/shared/components/ui';
import type { PurchaseStatus } from '../../types';
import { usePurchasesStore } from '../../store';

export function usePurchasesTableUrlSync() {
  const store = usePurchasesStore();

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

  useEffect(() => {
    if (urlPage !== store.currentPage) store.setCurrentPage(urlPage);
  }, [urlPage, store]);

  useEffect(() => {
    if (urlPageSize !== store.pageSize) store.setPageSize(urlPageSize);
  }, [urlPageSize, store]);

  useEffect(() => {
    if (urlSortBy !== store.sortBy || urlSortOrder !== store.sortOrder) {
      store.setSort(urlSortBy, urlSortOrder);
    }
  }, [urlSortBy, urlSortOrder, store]);

  useEffect(() => {
    if (urlFilters.search !== undefined && urlFilters.search !== store.searchTerm) {
      store.setSearchTerm(urlFilters.search);
    }
  }, [urlFilters.search, store]);

  useEffect(() => {
    if (urlFilters.status && urlFilters.status !== store.statusFilter) {
      store.setStatusFilter(urlFilters.status as PurchaseStatus | 'ALL');
    }
  }, [urlFilters.status, store]);

  const handleSearchChange = useCallback(
    (val: string) => {
      store.setSearchTerm(val);
      setUrlFilter('search', val || null);
    },
    [store, setUrlFilter]
  );

  const handleStatusFilterChange = useCallback(
    (status: PurchaseStatus | 'ALL') => {
      store.setStatusFilter(status);
      setUrlFilter('status', status === 'ALL' ? null : status);
    },
    [store, setUrlFilter]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      store.setCurrentPage(page);
      setUrlPage(page);
    },
    [store, setUrlPage]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      store.setPageSize(size);
      setUrlPageSize(size);
    },
    [store, setUrlPageSize]
  );

  const handleSortChange = useCallback(
    (key: string, order: 'asc' | 'desc' | null) => {
      store.setSort(key, order);
      setUrlSort(key, order);
    },
    [store, setUrlSort]
  );

  return {
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  };
}

