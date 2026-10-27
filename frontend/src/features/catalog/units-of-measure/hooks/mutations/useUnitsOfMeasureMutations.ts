import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { UnitOfMeasure, CreateUomDto, UpdateUomDto } from '../../types';

interface UseUnitsOfMeasureMutationsOptions {
  onSuccess?: () => void;
}

export function useUnitsOfMeasureMutations(
  options: UseUnitsOfMeasureMutationsOptions = {}
) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const createUom = useCallback(
    async (dto: CreateUomDto): Promise<UnitOfMeasure> => {
      try {
        setIsMutating(true);
        setError('');
        const result = await ApiClient.post<UnitOfMeasure>('/catalog/uofm', dto);
        options.onSuccess?.();
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al crear la unidad de medida';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  const updateUom = useCallback(
    async (id: string, dto: UpdateUomDto): Promise<UnitOfMeasure> => {
      try {
        setIsMutating(true);
        setError('');
        const result = await ApiClient.put<UnitOfMeasure>(`/catalog/uofm/${id}`, dto);
        options.onSuccess?.();
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al actualizar la unidad de medida';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  const deleteUom = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsMutating(true);
        setError('');
        await ApiClient.delete(`/catalog/uofm/${id}`);
        options.onSuccess?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al eliminar la unidad de medida';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [options]
  );

  return {
    createUom,
    updateUom,
    deleteUom,
    isMutating,
    error,
    clearError,
  };
}
