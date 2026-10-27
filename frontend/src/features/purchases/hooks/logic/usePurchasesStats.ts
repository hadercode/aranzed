import { useMemo } from 'react';
import type { Purchase, PurchaseStats } from '../../types';

export function usePurchasesStats(purchases: Purchase[]): { stats: PurchaseStats } {
  const stats = useMemo<PurchaseStats>(() => {
    let completedCount = 0;
    let draftCount = 0;
    let cancelledCount = 0;
    let totalInvested = 0;

    for (const p of purchases) {
      if (p.status === 'COMPLETED') {
        completedCount++;
        totalInvested += Number(p.total) || 0;
      } else if (p.status === 'DRAFT') {
        draftCount++;
      } else if (p.status === 'CANCELLED') {
        cancelledCount++;
      }
    }

    const totalCount = purchases.length;
    const averageTicket = completedCount > 0 ? totalInvested / completedCount : 0;

    return {
      totalCount,
      completedCount,
      draftCount,
      cancelledCount,
      totalInvested: Number(totalInvested.toFixed(2)),
      averageTicket: Number(averageTicket.toFixed(2)),
    };
  }, [purchases]);

  return { stats };
}
