import { useState, useMemo, useCallback } from 'react';
import type { Recipe, RecipeStatus } from '../../types';

export interface UseRecipeFiltersProps {
  recipes: Recipe[];
  onFilterChange?: () => void;
}

/**
 * Sub-hook for managing recipe search terms, status filters,
 * and filtered dataset derivation with automated pagination resets.
 */
export function useRecipeFilters({ recipes, onFilterChange }: UseRecipeFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RecipeStatus | 'ALL'>('ALL');

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleStatusChange = useCallback(
    (status: RecipeStatus | 'ALL') => {
      setStatusFilter(status);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('ALL');
    onFilterChange?.();
  }, [onFilterChange]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Status filter
      if (statusFilter !== 'ALL' && recipe.status !== statusFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const codeMatch = recipe.code.toLowerCase().includes(query);
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const productMatch = recipe.product?.name.toLowerCase().includes(query);
        if (!codeMatch && !nameMatch && !productMatch) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, statusFilter, searchTerm]);

  const isFiltered = searchTerm.trim().length > 0 || statusFilter !== 'ALL';

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    filteredRecipes,
    isFiltered,
    resetFilters,
  };
}

export type UseRecipeFiltersReturn = ReturnType<typeof useRecipeFilters>;
