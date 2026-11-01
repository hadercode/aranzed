import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService, type CreateRoleDto, type UpdateRoleDto } from '../../services';
import { ROLES_QUERY_KEY } from '../queries/useRolesQuery';

export interface UseRoleMutationsOptions {
  onSuccess?: () => void;
}

export function useRoleMutations(options?: UseRoleMutationsOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const invalidateRoles = () => {
    queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    options?.onSuccess?.();
  };

  const createMutation = useMutation({
    mutationFn: (dto: CreateRoleDto) => rolesService.create(dto),
    onSuccess: invalidateRoles,
    onError: (err: any) => setError(err.message || 'Error al crear rol'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRoleDto }) => rolesService.update(id, dto),
    onSuccess: invalidateRoles,
    onError: (err: any) => setError(err.message || 'Error al actualizar rol'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: invalidateRoles,
    onError: (err: any) => setError(err.message || 'Error al eliminar rol'),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const createRole = async (name: string, description: string) => {
    setError('');
    return createMutation.mutateAsync({ name, description });
  };

  const updateRole = async (id: string, name: string, description: string) => {
    setError('');
    return updateMutation.mutateAsync({ id, dto: { name, description } });
  };

  const deleteRole = async (id: string) => {
    setError('');
    return deleteMutation.mutateAsync(id);
  };

  return {
    createRole,
    updateRole,
    deleteRole,
    isMutating,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
