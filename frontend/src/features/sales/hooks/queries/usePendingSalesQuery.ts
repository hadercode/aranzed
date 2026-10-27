import { useQuery } from '@tanstack/react-query';
import { salesPaymentsService } from '../../services';
import type { PendingSaleForPayment } from '../../types';

export function usePendingSalesQuery(customerName?: string) {
  const query = useQuery<PendingSaleForPayment[]>({
    queryKey: ['sales', 'pending-for-payment', customerName?.trim() || 'all'],
    queryFn: () => salesPaymentsService.getPendingSales(customerName?.trim() || undefined),
    staleTime: 1000 * 20, // 20 segundos
  });

  return {
    pendingSales: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
