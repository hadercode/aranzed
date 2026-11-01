import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../../services';
import type { Product, CreateProductDto, UpdateProductDto } from '../../types';

export const PRODUCTS_QUERY_KEY = ['catalog', 'products'] as const;

export interface UseProductsMutationsOptions {
  onSuccess?: () => void;
}

export function useProductsMutations(
  options: UseProductsMutationsOptions = {}
) {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    options.onSuccess?.();
  }, [queryClient, options]);

  // 1. Create Mutation
  const createMutation = useMutation<Product, Error, CreateProductDto>({
    mutationFn: (dto: CreateProductDto) => productsService.create(dto),
    onSuccess: invalidateProducts,
  });

  // 2. Update Mutation
  const updateMutation = useMutation<
    Product,
    Error,
    { id: string; dto: UpdateProductDto }
  >({
    mutationFn: ({ id, dto }) => productsService.update(id, dto),
    onSuccess: invalidateProducts,
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: invalidateProducts,
  });

  // 4. Upload Image Mutation
  const uploadImageMutation = useMutation<string, Error, File>({
    mutationFn: (file: File) => productsService.uploadImage(file),
  });

  // Async wrappers ensuring backward compatibility with existing callers
  const createProduct = useCallback(
    async (dto: CreateProductDto): Promise<Product> => {
      return createMutation.mutateAsync(dto);
    },
    [createMutation]
  );

  const updateProduct = useCallback(
    async (id: string, dto: UpdateProductDto): Promise<Product> => {
      return updateMutation.mutateAsync({ id, dto });
    },
    [updateMutation]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const uploadProductImage = useCallback(
    async (file: File): Promise<string> => {
      return uploadImageMutation.mutateAsync(file);
    },
    [uploadImageMutation]
  );

  // Computed states
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const isUploading = uploadImageMutation.isPending;

  const activeMutationError =
    createMutation.error || updateMutation.error || deleteMutation.error;

  const error = activeMutationError
    ? activeMutationError.message || 'Error en la operación del producto'
    : '';

  const uploadError = uploadImageMutation.error
    ? uploadImageMutation.error.message || 'Error al subir la imagen'
    : '';

  const clearError = useCallback(() => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  }, [createMutation, updateMutation, deleteMutation]);

  const clearUploadError = useCallback(() => {
    uploadImageMutation.reset();
  }, [uploadImageMutation]);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    createMutation,
    updateMutation,
    deleteMutation,
    uploadImageMutation,
    isMutating,
    isUploading,
    error,
    uploadError,
    clearError,
    clearUploadError,
  };
}
