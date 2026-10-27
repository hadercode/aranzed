import { useState, useMemo, useCallback } from 'react';
import type { Category, CategoryStatusFilter } from '../../types';

export interface UseCategoriesFiltersProps {
  categories: Category[];
}

export function useCategoriesFilters({ categories }: UseCategoriesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesPath = cat.path ? cat.path.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesPath) return false;
      }

      // Status filter
      if (statusFilter === 'active' && !cat.isActive) return false;
      if (statusFilter === 'inactive' && cat.isActive) return false;

      // Parent filter
      if (parentFilter === 'root' && cat.parentId) return false;
      if (parentFilter !== 'all' && parentFilter !== 'root' && cat.parentId !== parentFilter) {
        return false;
      }

      return true;
    });
  }, [categories, searchTerm, statusFilter, parentFilter]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  }, [filteredCategories.length, itemsPerPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: CategoryStatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleParentFilterChange = useCallback((value: string) => {
    setParentFilter(value);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setParentFilter('all');
    setCurrentPage(1);
  }, []);

  return {
    searchTerm,
    statusFilter,
    parentFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    filteredCategories,
    paginatedCategories,
    handleSearchChange,
    handleStatusFilterChange,
    handleParentFilterChange,
    handleItemsPerPageChange,
    handleResetFilters,
    setCurrentPage,
    setItemsPerPage,
  };
}
