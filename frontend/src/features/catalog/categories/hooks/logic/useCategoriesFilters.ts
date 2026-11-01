import { useMemo, useCallback } from 'react';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import type { Category, CategoryStatusFilter } from '../../types';

export interface UseCategoriesFiltersProps {
  categories: Category[];
}

export function useCategoriesFilters({ categories }: UseCategoriesFiltersProps) {
  const store = useCategoriesStore();

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Search filter
      if (store.searchTerm.trim()) {
        const query = store.searchTerm.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesPath = cat.path ? cat.path.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesPath) return false;
      }

      // Status filter
      if (store.statusFilter === 'active' && !cat.isActive) return false;
      if (store.statusFilter === 'inactive' && cat.isActive) return false;

      // Parent filter
      if (store.parentFilter === 'root' && cat.parentId) return false;
      if (store.parentFilter !== 'all' && store.parentFilter !== 'root' && cat.parentId !== store.parentFilter) {
        return false;
      }

      return true;
    });
  }, [categories, store.searchTerm, store.statusFilter, store.parentFilter]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (store.currentPage - 1) * store.itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + store.itemsPerPage);
  }, [filteredCategories, store.currentPage, store.itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredCategories.length / store.itemsPerPage));
  }, [filteredCategories.length, store.itemsPerPage]);

  const handleSearchChange = useCallback(
    (value: string) => {
      store.setSearchTerm(value);
    },
    [store]
  );

  const handleStatusFilterChange = useCallback(
    (value: CategoryStatusFilter) => {
      store.setStatusFilter(value);
    },
    [store]
  );

  const handleParentFilterChange = useCallback(
    (value: string) => {
      store.setParentFilter(value);
    },
    [store]
  );

  const handleItemsPerPageChange = useCallback(
    (value: number) => {
      store.setItemsPerPage(value);
    },
    [store]
  );

  const handleResetFilters = useCallback(() => {
    store.resetFilters();
  }, [store]);

  return {
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,
    parentFilter: store.parentFilter,
    currentPage: store.currentPage,
    itemsPerPage: store.itemsPerPage,
    filteredCategories,
    paginatedCategories,
    totalPages,
    handleSearchChange,
    handleStatusFilterChange,
    handleParentFilterChange,
    handleItemsPerPageChange,
    handleResetFilters,
    setCurrentPage: store.setCurrentPage,
  };
}
