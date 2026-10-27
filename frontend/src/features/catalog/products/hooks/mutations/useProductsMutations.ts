import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Product, CreateProductDto, UpdateProductDto } from '../../types';

interface UseProductsMutationsOptions {
  onSuccess?: () => void;
}

export function useProductsMutations(
  options: UseProductsMutationsOptions = {}
) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const createProduct = useCallback(
    async (dto: CreateProductDto): Promise<Product> => {
      try {
        setIsMutating(true);
        setError('');
        const result = await ApiClient.post<Product>('/catalog/products', dto);
        options.onSuccess?.();
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al crear el producto';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  const updateProduct = useCallback(
    async (id: string, dto: UpdateProductDto): Promise<Product> => {
      try {
        setIsMutating(true);
        setError('');
        const result = await ApiClient.put<Product>(`/catalog/products/${id}`, dto);
        options.onSuccess?.();
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al actualizar el producto';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsMutating(true);
        setError('');
        await ApiClient.delete(`/catalog/products/${id}`);
        options.onSuccess?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al eliminar el producto';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    isMutating,
    error,
    clearError,
  };
}
