import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../../services';
import { CATEGORIES_QUERY_KEY } from '../queries/useCategoriesQuery';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types';

export interface UseCategoriesMutationsOptions {
  onSuccess?: () => void;
}

export function useCategoriesMutations(options: UseCategoriesMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    options.onSuccess?.();
  };

  const createMutation = useMutation<Category, Error, CreateCategoryDto>({
    mutationFn: (dto: CreateCategoryDto) => categoriesService.create(dto),
    onSuccess: invalidateCategories,
  });

  const updateMutation = useMutation<Category, Error, { id: string; dto: UpdateCategoryDto }>({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDto }) =>
      categoriesService.update(id, dto),
    onSuccess: invalidateCategories,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: invalidateCategories,
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const activeError =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  const error = activeError
    ? activeError instanceof Error
      ? activeError.message
      : typeof activeError === 'string'
      ? activeError
      : 'Error en la operación de categoría'
    : '';

  const clearError = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
    return createMutation.mutateAsync(dto);
  };

  const updateCategory = async (id: string, dto: UpdateCategoryDto): Promise<Category> => {
    return updateMutation.mutateAsync({ id, dto });
  };

  const deleteCategory = async (id: string): Promise<void> => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating,
    error,
    clearError,
  };
}
