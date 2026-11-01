import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipesQuery } from '../queries/useRecipesQuery';
import { useRecipesMutations } from '../mutations/useRecipesMutations';
import { useRecipeFilters } from './useRecipeFilters';
import { useRecipeStats } from './useRecipeStats';
import { useRecipeActions } from './useRecipeActions';
import { useRecipeSorting } from './useRecipeSorting';
import type { Recipe } from '../../types';

export function useRecipesPage() {
  const navigate = useNavigate();
  const { data: recipes, loading, error, refetch } = useRecipesQuery();
  const { deleteRecipe, syncCost, isMutating } = useRecipesMutations();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const { stats } = useRecipeStats(recipes);

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

  const { sortBy, sortOrder, handleSortChange, sortedRecipes } = useRecipeSorting(filteredRecipes);

  const totalPages = Math.max(1, Math.ceil(sortedRecipes.length / itemsPerPage));
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecipes.slice(start, start + itemsPerPage);
  }, [sortedRecipes, currentPage, itemsPerPage]);

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

    sortBy,
    sortOrder,
    handleSortChange,

    deletingRecipe,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDeleteClick,
    handleConfirmDelete,
    handleSyncCostClick,
    handleCreateNew,
    handleEdit,

    isMutating,
    actionError,
    setActionError,
    isSuccessOpen,
    setIsSuccessOpen,
    successMessage,
  };
}

export type UseRecipesPageReturn = ReturnType<typeof useRecipesPage>;
