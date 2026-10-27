import { useQuery } from '@tanstack/react-query';
import { salesService } from '../../services';
import type { Sale, SaleFilters, SaleStats } from '../../types';

export function useSalesQuery(filters?: SaleFilters) {
  const salesListQuery = useQuery<{ sales: Sale[]; total: number }>({
    queryKey: ['sales', 'list', filters],
    queryFn: () => salesService.getAll(filters),
    staleTime: 1000 * 60,
  });

  const salesStatsQuery = useQuery<SaleStats>({
    queryKey: ['sales', 'stats', filters?.startDate, filters?.endDate],
    queryFn: () => salesService.getStats(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    sales: salesListQuery.data?.sales || [],
    total: salesListQuery.data?.total || 0,
    stats: salesStatsQuery.data || {
      totalSalesCount: 0,
      totalQuotationsCount: 0,
      completedSalesCount: 0,
      draftCount: 0,
      cancelledCount: 0,
      totalRevenueUSD: 0,
      totalRevenueLocal: 0,
      averageTicketUSD: 0,
    },
    isLoading: salesListQuery.isLoading || salesStatsQuery.isLoading,
    isError: salesListQuery.isError || salesStatsQuery.isError,
    error: salesListQuery.error || salesStatsQuery.error,
    refetch: async () => {
      await Promise.all([salesListQuery.refetch(), salesStatsQuery.refetch()]);
    },
  };
}
