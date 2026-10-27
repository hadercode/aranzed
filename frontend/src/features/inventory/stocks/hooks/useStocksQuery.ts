import { useQuery } from '@tanstack/react-query';
import { stocksService } from '../services';
import type { StockFilters } from '../types';

export function useStocksQuery(filters: StockFilters = {}) {
  const { data: stocks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inventory', 'stocks', filters],
    queryFn: () => stocksService.getStocks(filters),
    staleTime: 1000 * 60,
  });

  // Métricas rápidas calculadas en cliente
  const stats = {
    totalItems: stocks.length,
    totalPhysicalUnits: stocks.reduce((acc, s) => acc + Number(s.physicalQty || 0), 0),
    totalReservedUnits: stocks.reduce((acc, s) => acc + Number(s.reservedQty || 0), 0),
    totalAvailableUnits: stocks.reduce((acc, s) => acc + Number(s.availableQty || 0), 0),
    totalValuationUSD: stocks.reduce(
      (acc, s) => acc + Number(s.physicalQty || 0) * Number(s.unitCost || 0),
      0,
    ),
    totalValuationLocal: stocks.reduce(
      (acc, s) =>
        acc +
        Number(s.physicalQty || 0) *
          Number(s.unitCost || 0) *
          Number(s.exchangeRate || 1),
      0,
    ),
  };

  return {
    stocks,
    stats,
    isLoading,
    error,
    refetch,
  };
}

export function useAdjustmentsReportQuery() {
  const { data: adjustmentsReport = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inventory', 'adjustments-report'],
    queryFn: () => stocksService.getAdjustmentsReport(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    adjustmentsReport,
    isLoading,
    error,
    refetch,
  };
}

