import { useQuery } from '@tanstack/react-query';
import { rolesService, type Role, type Permission } from '../../services';

export type { Role, Permission };

export const ROLES_QUERY_KEY = ['roles'] as const;

export function useRolesQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Role[], Error>({
    queryKey: ROLES_QUERY_KEY,
    queryFn: () => rolesService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar los roles'
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

export function useRoleQuery(id?: string) {
  return useQuery<Role, Error>({
    queryKey: [...ROLES_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('ID de rol requerido');
      return rolesService.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
