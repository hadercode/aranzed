import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../services';
import type { User } from '../../types/user';

export const USERS_QUERY_KEY = ['users'] as const;

export function useUsersQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<User[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar los usuarios'
    : '';

  return {
    data,
    loading: isLoading,
    isFetching,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}

export function useUserQuery(id?: string) {
  return useQuery<User, Error>({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('ID de usuario requerido');
      return usersService.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
