import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsService } from '../../services';
import { ROLES_QUERY_KEY } from '@/features/roles/hooks/queries/useRolesQuery';

interface UseRolePermissionsMutationsOptions {
  onSuccess?: () => void;
}

export function useRolePermissionsMutations(options?: UseRolePermissionsMutationsOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const syncMutation = useMutation({
    mutationFn: async ({
      roleId,
      originalPerms,
      newPerms,
    }: {
      roleId: string;
      originalPerms: Set<string>;
      newPerms: Set<string>;
    }) => {
      const toAdd = Array.from(newPerms).filter((id) => !originalPerms.has(id));
      const toRemove = Array.from(originalPerms).filter((id) => !newPerms.has(id));
      await permissionsService.syncRolePermissions(roleId, toAdd, toRemove);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      const errMsg = err?.message || (typeof err === 'string' ? err : 'Error al actualizar los permisos del rol');
      setError(errMsg);
    },
  });

  const savePermissions = async (
    roleId: string,
    originalPerms: Set<string>,
    newPerms: Set<string>
  ) => {
    setError('');
    return syncMutation.mutateAsync({ roleId, originalPerms, newPerms });
  };

  return {
    savePermissions,
    isSaving: syncMutation.isPending,
    isMutating: syncMutation.isPending,
    error,
    clearError,
    syncMutation,
  };
}
