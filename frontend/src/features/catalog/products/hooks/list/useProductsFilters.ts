import { useMemo, useCallback } from 'react';
import { useProductsStore } from '../../store';
import type { Product } from '../../types';

export interface UseProductsFiltersProps {
  products: Product[];
}

export function useProductsFilters({ products }: UseProductsFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    uomFilter,
    setUomFilter,
    sortBy,
    sortOrder,
    setSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    resetFilters,
  } = useProductsStore();

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = (prod.description || '').toLowerCase().includes(query);
        const matchesUom = (prod.uom?.code || '').toLowerCase().includes(query);
        const matchesCat = (prod.category?.name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesUom && !matchesCat) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && prod.type !== typeFilter) return false;

      // Status filter
      if (statusFilter === 'active' && !prod.isActive) return false;
      if (statusFilter === 'inactive' && prod.isActive) return false;

      // Category filter
      if (categoryFilter !== 'all' && prod.categoryId !== categoryFilter) return false;

      // UoM filter
      if (uomFilter !== 'all' && prod.uomId !== uomFilter) return false;

      return true;
    });
  }, [products, searchTerm, typeFilter, statusFilter, categoryFilter, uomFilter]);

  const handleSortChange = useCallback(
    (field: string, order: 'asc' | 'desc' | null) => {
      setSort(order ? field : null, order);
    },
    [setSort]
  );

  const sortedProducts = useMemo(() => {
    if (!sortBy || !sortOrder) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      let valA: unknown = a[sortBy as keyof Product];
      let valB: unknown = b[sortBy as keyof Product];

      if (sortBy === 'category') {
        valA = a.category?.name || '';
        valB = b.category?.name || '';
      } else if (sortBy === 'uom') {
        valA = a.uom?.code || '';
        valB = b.uom?.code || '';
      }

      if (typeof valA === 'string') {
        const cmp = (valA as string).localeCompare(String(valB || ''), 'es', {
          sensitivity: 'base',
        });
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      if (typeof valA === 'boolean') {
        const numA = valA ? 1 : 0;
        const numB = valB ? 1 : 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });
  }, [filteredProducts, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    uomFilter,
    setUomFilter,
    sortBy,
    sortOrder,
    handleSortChange,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredProducts,
    sortedProducts,
    paginatedProducts,
    resetFilters,
  };
}
