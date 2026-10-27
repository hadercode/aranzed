import { useMemo } from 'react';
import type { TransactionFormItem } from './useTransactionFormItems';

export interface TransactionMetrics {
  totalItems: number;
  totalQuantity: number;
  totalEstimatedCostUSD: number;
}

export function useTransactionCalculations(items: TransactionFormItem[]): TransactionMetrics {
  return useMemo(() => {
    const totalItems = items.filter((it) => it.productId).length;
    const totalQuantity = items.reduce(
      (acc, it) => acc + Number(it.quantity || 0),
      0
    );
    const totalEstimatedCostUSD = items.reduce(
      (acc, it) => acc + Number(it.quantity || 0) * Number(it.cost || 0),
      0
    );

    return {
      totalItems,
      totalQuantity,
      totalEstimatedCostUSD,
    };
  }, [items]);
}

export default useTransactionCalculations;
