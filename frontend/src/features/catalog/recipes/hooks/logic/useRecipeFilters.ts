import { useMemo, useCallback } from 'react';
import { useRecipesStore } from '../../store/useRecipesStore';
import type { Recipe, RecipeStatus } from '../../types';

export interface UseRecipeFiltersProps {
  recipes: Recipe[];
  onFilterChange?: () => void;
}

export function useRecipeFilters({ recipes, onFilterChange }: UseRecipeFiltersProps) {
  const store = useRecipesStore();

  const handleSearchChange = useCallback(
    (term: string) => {
      store.setSearchTerm(term);
      onFilterChange?.();
    },
    [store, onFilterChange]
  );

  const handleStatusChange = useCallback(
    (status: RecipeStatus | 'ALL') => {
      store.setStatusFilter(status);
      onFilterChange?.();
    },
    [store, onFilterChange]
  );

  const resetFilters = useCallback(() => {
    store.resetFilters();
    onFilterChange?.();
  }, [store, onFilterChange]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Status filter
      if (store.statusFilter !== 'ALL' && recipe.status !== store.statusFilter) {
        return false;
      }

      // Search term
      if (store.searchTerm.trim()) {
        const query = store.searchTerm.toLowerCase();
        const codeMatch = recipe.code?.toLowerCase().includes(query);
        const nameMatch = recipe.name?.toLowerCase().includes(query);
        const productMatch = recipe.product?.name?.toLowerCase().includes(query);
        if (!codeMatch && !nameMatch && !productMatch) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, store.statusFilter, store.searchTerm]);

  const isFiltered = Boolean(store.searchTerm.trim() || store.statusFilter !== 'ALL');

  return {
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,
    setSearchTerm: handleSearchChange,
    setStatusFilter: handleStatusChange,
    handleSearchChange,
    handleStatusChange,
    resetFilters,
    filteredRecipes,
    isFiltered,
  };
}
