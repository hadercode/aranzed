import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsOfMeasureService } from '../../services';
import { UOMS_QUERY_KEY } from '../queries/useUnitsOfMeasureQuery';
import type { UnitOfMeasure, CreateUomDto, UpdateUomDto } from '../../types';

export interface UseUnitsOfMeasureMutationsOptions {
  onSuccess?: () => void;
}

export function useUnitsOfMeasureMutations(
  options: UseUnitsOfMeasureMutationsOptions = {}
) {
  const queryClient = useQueryClient();

  const invalidateUoms = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: UOMS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['catalog', 'products'] });
    options.onSuccess?.();
  }, [queryClient, options]);

  // 1. Create Mutation
  const createMutation = useMutation<UnitOfMeasure, Error, CreateUomDto>({
    mutationFn: (dto: CreateUomDto) => unitsOfMeasureService.create(dto),
    onSuccess: invalidateUoms,
  });

  // 2. Update Mutation
  const updateMutation = useMutation<
    UnitOfMeasure,
    Error,
    { id: string; dto: UpdateUomDto }
  >({
    mutationFn: ({ id, dto }) => unitsOfMeasureService.update(id, dto),
    onSuccess: invalidateUoms,
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => unitsOfMeasureService.delete(id),
    onSuccess: invalidateUoms,
  });

  // Async wrappers for backward compatibility
  const createUom = useCallback(
    async (dto: CreateUomDto): Promise<UnitOfMeasure> => {
      return createMutation.mutateAsync(dto);
    },
    [createMutation]
  );

  const updateUom = useCallback(
    async (id: string, dto: UpdateUomDto): Promise<UnitOfMeasure> => {
      return updateMutation.mutateAsync({ id, dto });
    },
    [updateMutation]
  );

  const deleteUom = useCallback(
    async (id: string): Promise<void> => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const activeMutationError =
    createMutation.error || updateMutation.error || deleteMutation.error;

  const error = activeMutationError
    ? activeMutationError.message || 'Error en la operación de unidad de medida'
    : '';

  const clearError = useCallback(() => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  }, [createMutation, updateMutation, deleteMutation]);

  return {
    createUom,
    updateUom,
    deleteUom,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating,
    error,
    clearError,
  };
}
