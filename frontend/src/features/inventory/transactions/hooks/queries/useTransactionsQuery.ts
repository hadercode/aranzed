import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../../services';
import { useTransactionMutations } from '../mutations/useTransactionMutations';
import type { TransactionFilters } from '../../types';

export function useTransactionsQuery(filters: TransactionFilters = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory', 'transactions', filters],
    queryFn: () => transactionsService.getAll(filters),
    staleTime: 1000 * 60,
  });

  const transactions = data?.data || [];
  const total = data?.total ?? 0;
  const page = data?.page ?? (filters.page || 1);
  const limit = data?.limit ?? (filters.limit || filters.pageSize || 10);
  const totalPages = data?.totalPages ?? 1;

  // Re-exportamos mutaciones para compatibilidad total con código existente
  const mutations = useTransactionMutations();

  return {
    transactions,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    ...mutations,
  };
}

export default useTransactionsQuery;
