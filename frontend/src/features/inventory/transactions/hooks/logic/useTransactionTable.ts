import type { InventoryTransaction } from '../../types';
import { useTransactionTableSorting } from './useTransactionTableSorting';
import { useTransactionTablePagination } from './useTransactionTablePagination';
import { useTransactionTableData } from './useTransactionTableData';

export interface UseTransactionTableParams {
  transactions: InventoryTransaction[];
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function useTransactionTable({
  transactions,
  sortBy,
  sortOrder,
  onSortChange,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: UseTransactionTableParams) {
  const sorting = useTransactionTableSorting({
    propSortBy: sortBy,
    propSortOrder: sortOrder,
    onSortChange,
  });

  const pagination = useTransactionTablePagination({
    propCurrentPage: currentPage,
    propPageSize: pageSize,
    propTotalItems: totalItems,
    propTotalPages: totalPages,
    onPageChange,
    onPageSizeChange,
    itemsCount: transactions.length,
  });

  const processedData = useTransactionTableData({
    transactions,
    isControlledPagination: pagination.isControlledPagination,
    activeSortBy: sorting.activeSortBy,
    activeSortOrder: sorting.activeSortOrder,
    activePage: pagination.activePage,
    activePageSize: pagination.activePageSize,
  });

  return {
    processedData,
    ...sorting,
    ...pagination,
  };
}

