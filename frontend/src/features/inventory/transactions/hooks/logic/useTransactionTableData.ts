import { useMemo } from 'react';
import type { InventoryTransaction } from '../../types';

export interface UseTransactionTableDataParams {
  transactions: InventoryTransaction[];
  isControlledPagination: boolean;
  activeSortBy?: string | null;
  activeSortOrder?: 'asc' | 'desc' | null;
  activePage: number;
  activePageSize: number;
}

export function useTransactionTableData({
  transactions,
  isControlledPagination,
  activeSortBy,
  activeSortOrder,
  activePage,
  activePageSize,
}: UseTransactionTableDataParams) {
  return useMemo(() => {
    if (isControlledPagination) return transactions;
    const sorted = [...transactions];
    if (activeSortBy && activeSortOrder) {
      sorted.sort((a, b) => {
        const aVal: any = (a as any)[activeSortBy];
        const bVal: any = (b as any)[activeSortBy];
        if (activeSortBy === 'movementDate') {
          const aTime = new Date(a.movementDate || 0).getTime();
          const bTime = new Date(b.movementDate || 0).getTime();
          return activeSortOrder === 'asc' ? aTime - bTime : bTime - aTime;
        }
        if (typeof aVal === 'string') {
          return activeSortOrder === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return activeSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    const startIndex = (activePage - 1) * activePageSize;
    return sorted.slice(startIndex, startIndex + activePageSize);
  }, [
    transactions,
    isControlledPagination,
    activeSortBy,
    activeSortOrder,
    activePage,
    activePageSize,
  ]);
}

