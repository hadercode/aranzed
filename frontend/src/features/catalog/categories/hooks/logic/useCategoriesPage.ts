import { useMemo } from 'react';
import { useCategoriesQuery } from '../queries/useCategoriesQuery';
import { useCategoriesMutations } from '../mutations/useCategoriesMutations';
import { useCategoriesStats } from './useCategoriesStats';
import { useCategoriesFilters } from './useCategoriesFilters';
import { useCategoriesDialogs } from './useCategoriesDialogs';
import { useCategoriesFormModal } from './useCategoriesFormModal';
import type { Category } from '../../types';

export function useCategoriesPage() {
  const { data: categories, loading, error: fetchError, refetch } = useCategoriesQuery();

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useCategoriesMutations();

  // Category Map for fast parent name resolution
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    for (const cat of categories) {
      map.set(cat.id, cat);
    }
    return map;
  }, [categories]);

  // Derived KPI Stats
  const { stats } = useCategoriesStats({ categories });

  // Filters & Pagination
  const filterState = useCategoriesFilters({ categories });

  // Delete confirmation & feedback dialogs
  const dialogState = useCategoriesDialogs({
    deleteCategory,
  });

  // Modal form logic & circular hierarchy prevention
  const formModalState = useCategoriesFormModal({
    categories,
    createCategory,
    updateCategory,
    clearMutationError,
    onSuccess: dialogState.showSuccess,
  });

  return {
    categories,
    categoryMap,
    stats,
    loading,
    fetchError,
    mutationError,
    isMutating,
    clearMutationError,
    refetch,

    // Filters & Pagination
    ...filterState,

    // Form Modal
    ...formModalState,

    // Delete Confirmation & Success Feedback
    ...dialogState,
  };
}

export type UseCategoriesPageReturn = ReturnType<typeof useCategoriesPage>;
