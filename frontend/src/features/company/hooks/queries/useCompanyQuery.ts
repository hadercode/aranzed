import { useQuery } from '@tanstack/react-query';
import { companyService, type Company } from '../../services';

export type { Company };

export const COMPANY_QUERY_KEY = ['company'] as const;

export function useCompanyQuery() {
  const {
    data = null,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Company, Error>({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: () => companyService.getCompany(),
    staleTime: 1000 * 60 * 10,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar los datos de la empresa'
    : '';

  return {
    data,
    loading: isLoading,
    isFetching,
    error,
    refetch: async () => {
      await refetch();
    },
    setData: (_val: Company | null) => {},
  };
}
