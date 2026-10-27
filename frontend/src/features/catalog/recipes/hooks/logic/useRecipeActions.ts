import { useState, useCallback } from 'react';
import type { Recipe } from '../../types';

export interface UseRecipeActionsProps {
  deleteRecipe: (id: string) => Promise<unknown>;
  syncCost: (id: string) => Promise<unknown>;
  refetch: () => Promise<unknown>;
}

/**
 * Sub-hook for managing recipe list actions:
 * - Delete modal confirmation flow
 * - One-click cost synchronization
 * - Error and success feedback dialog states
 */
export function useRecipeActions({
  deleteRecipe,
  syncCost,
  refetch,
}: UseRecipeActionsProps) {
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDeleteClick = useCallback((recipe: Recipe) => {
    setDeletingRecipe(recipe);
    setIsDeleteOpen(true);
    setActionError(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingRecipe) return;

    try {
      await deleteRecipe(deletingRecipe.id);
      setIsDeleteOpen(false);
      setDeletingRecipe(null);
      setSuccessMessage(`La receta "${deletingRecipe.name}" ha sido eliminada con éxito.`);
      setIsSuccessOpen(true);
      await refetch();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al eliminar la receta';
      setActionError(msg);
    }
  }, [deletingRecipe, deleteRecipe, refetch]);

  const handleSyncCostClick = useCallback(
    async (recipe: Recipe) => {
      try {
        await syncCost(recipe.id);
        setSuccessMessage(
          `Costo unitario sincronizado correctamente con "${recipe.product?.name || recipe.name}".`
        );
        setIsSuccessOpen(true);
        await refetch();
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al sincronizar el costo';
        setActionError(msg);
      }
    },
    [syncCost, refetch]
  );

  return {
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
  };
}

export type UseRecipeActionsReturn = ReturnType<typeof useRecipeActions>;
