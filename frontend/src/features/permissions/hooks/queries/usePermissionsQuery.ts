import { useQuery } from '@tanstack/react-query';
import { permissionsService, type Permission } from '../../services';

export type { Permission };

export const PERMISSIONS_QUERY_KEY = ['permissions'] as const;

export function usePermissionsQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Permission[], Error>({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: () => permissionsService.getAll(),
    staleTime: 1000 * 60 * 10,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar los permisos'
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
