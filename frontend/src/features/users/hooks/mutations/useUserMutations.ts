import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, type CreateUserData, type UpdateUserData } from '../../services';
import { USERS_QUERY_KEY } from '../queries/useUsersQuery';
import type { User } from '../../types/user';

export type { CreateUserData, UpdateUserData };

export interface UseUserMutationsOptions {
  onSuccess?: () => void;
}

export function useUserMutations(options?: UseUserMutationsOptions) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState('');

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    options?.onSuccess?.();
  };

  const createMutation = useMutation<User, Error, CreateUserData>({
    mutationFn: (data) => usersService.create(data),
    onSuccess: invalidateUsers,
    onError: (err) => setMutationError(err.message || 'Error al crear usuario'),
  });

  const updateMutation = useMutation<User, Error, { id: string; data: UpdateUserData }>({
    mutationFn: ({ id, data }) => usersService.update(id, data),
    onSuccess: invalidateUsers,
    onError: (err) => setMutationError(err.message || 'Error al actualizar usuario'),
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => usersService.delete(id),
    onSuccess: invalidateUsers,
    onError: (err) => setMutationError(err.message || 'Error al eliminar usuario'),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const createUser = (data: CreateUserData) => {
    setMutationError('');
    return createMutation.mutateAsync(data);
  };

  const updateUser = (id: string, data: UpdateUserData) => {
    setMutationError('');
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteUser = (id: string) => {
    setMutationError('');
    return deleteMutation.mutateAsync(id);
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    isMutating,
    mutationError,
    setMutationError,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
