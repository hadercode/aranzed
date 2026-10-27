import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesPaymentsService } from '../../services';
import type { SalePayment, SalePaymentFilters } from '../../types';

export interface SalePaymentsStats {
  totalUsd: number;
  totalVes: number;
  confirmedCount: number;
  cancelledCount: number;
  todayCount: number;
}

function getTodayPrefix(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useSalePaymentsQuery(filters?: SalePaymentFilters) {
  const query = useQuery<{ payments: SalePayment[]; total: number }>({
    queryKey: ['sale-payments', 'list', filters],
    queryFn: () => salesPaymentsService.getAll(filters),
    staleTime: 1000 * 30, // 30 segundos
  });

  const rawPayments = query.data?.payments;
  const payments = useMemo(() => rawPayments || [], [rawPayments]);
  const total = query.data?.total || 0;

  const stats: SalePaymentsStats = useMemo(() => {
    let totalUsd = 0;
    let totalVes = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;
    let todayCount = 0;

    const todayStr = getTodayPrefix();

    for (const p of rawPayments || []) {
      if (p.status === 'CONFIRMED') {
        totalUsd += Number(p.amount || 0);
        totalVes += Number(p.amountLocal || 0);
        confirmedCount++;
      } else {
        cancelledCount++;
      }

      if (p.paymentDate && p.paymentDate.startsWith(todayStr)) {
        todayCount++;
      }
    }

    return {
      totalUsd: Number(totalUsd.toFixed(2)),
      totalVes: Number(totalVes.toFixed(2)),
      confirmedCount,
      cancelledCount,
      todayCount,
    };
  }, [rawPayments]);

  return {
    payments,
    total,
    stats,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
