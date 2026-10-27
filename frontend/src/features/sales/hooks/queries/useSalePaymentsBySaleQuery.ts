import { useQuery } from '@tanstack/react-query';
import { salesPaymentsService } from '../../services';
import type { SalePayment } from '../../types';

export function useSalePaymentsBySaleQuery(saleId: string | null | undefined) {
  const query = useQuery<SalePayment[]>({
    queryKey: ['sale-payments', 'by-sale', saleId],
    queryFn: () => salesPaymentsService.getBySaleId(saleId!),
    enabled: Boolean(saleId),
    staleTime: 1000 * 20,
  });

  return {
    payments: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
