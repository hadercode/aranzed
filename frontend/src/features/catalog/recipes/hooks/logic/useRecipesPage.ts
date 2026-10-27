import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipesQuery } from '../queries/useRecipesQuery';
import { useRecipesMutations } from '../mutations/useRecipesMutations';
import { useRecipeFilters } from './useRecipeFilters';
import { useRecipeStats } from './useRecipeStats';
import { useRecipeActions } from './useRecipeActions';
import type { Recipe } from '../../types';

/**
 * Top-level orchestrator hook for the recipe catalog page.
 * Composes query fetching, filtering, statistics, action workflows, and pagination.
 */
export function useRecipesPage() {
  const navigate = useNavigate();
  const { data: recipes, loading, error, refetch } = useRecipesQuery();
  const { deleteRecipe, syncCost, isMutating } = useRecipesMutations();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Delegated Filtering & Search Logic (auto-resets page on filter change)
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredRecipes,
    isFiltered,
    resetFilters,
  } = useRecipeFilters({
    recipes,
    onFilterChange: () => setCurrentPage(1),
  });

  // 2. Delegated KPI Statistics Computation
  const { stats } = useRecipeStats(recipes);

  // 3. Delegated List Actions & Dialogs
  const {
    deletingRecipe,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDeleteClick,
    handleConfirmDelete,
    handleSyncCostClick,
    actionError,
    setActionError,
    isSuccessOpen,
    setIsSuccessOpen,
    successMessage,
  } = useRecipeActions({
    deleteRecipe,
    syncCost,
    refetch,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const handleSortChange = useCallback((field: string, order: 'asc' | 'desc' | null) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const sortedRecipes = useMemo(() => {
    if (!sortBy || !sortOrder) return filteredRecipes;

    return [...filteredRecipes].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortBy) {
        case 'code':
          valA = a.code?.toLowerCase() || '';
          valB = b.code?.toLowerCase() || '';
          break;
        case 'name':
          valA = a.name?.toLowerCase() || '';
          valB = b.name?.toLowerCase() || '';
          break;
        case 'product':
          valA = a.product?.name?.toLowerCase() || '';
          valB = b.product?.name?.toLowerCase() || '';
          break;
        case 'yieldQuantity':
          valA = Number(a.yieldQuantity) || 0;
          valB = Number(b.yieldQuantity) || 0;
          break;
        case 'totalCost':
          valA = Number(a.totalCost) || 0;
          valB = Number(b.totalCost) || 0;
          break;
        case 'unitCost':
          valA = (Number(a.totalCost) || 0) / (Number(a.yieldQuantity) || 1);
          valB = (Number(b.totalCost) || 0) / (Number(b.yieldQuantity) || 1);
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        default:
          valA = (a as any)[sortBy];
          valB = (b as any)[sortBy];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecipes, sortBy, sortOrder]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(sortedRecipes.length / itemsPerPage));
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecipes.slice(start, start + itemsPerPage);
  }, [sortedRecipes, currentPage, itemsPerPage]);

  // Navigation Helpers
  const handleCreateNew = useCallback(() => {
    navigate('/catalog/recipes/new');
  }, [navigate]);

  const handleEdit = useCallback(
    (recipe: Recipe) => {
      navigate(`/catalog/recipes/${recipe.id}/edit`);
    },
    [navigate]
  );

  return {
    recipes: paginatedRecipes,
    totalRecipes: filteredRecipes.length,
    rawRecipesCount: recipes.length,
    loading,
    error,
    refetch,
    stats,

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isFiltered,
    resetFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,

    // Sorting
    sortBy,
    sortOrder,
    handleSortChange,

    // Actions & Dialogs
    deletingRecipe,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDeleteClick,
    handleConfirmDelete,
    handleSyncCostClick,
    handleCreateNew,
    handleEdit,

    // State feedback
    isMutating,
    actionError,
    setActionError,
    isSuccessOpen,
    setIsSuccessOpen,
    successMessage,
  };
}

export type UseRecipesPageReturn = ReturnType<typeof useRecipesPage>;
