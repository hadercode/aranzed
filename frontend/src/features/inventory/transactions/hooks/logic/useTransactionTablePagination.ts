import { useState } from 'react';

export interface UseTransactionTablePaginationParams {
  propCurrentPage?: number;
  propPageSize?: number;
  propTotalItems?: number;
  propTotalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  itemsCount: number;
  defaultPage?: number;
  defaultPageSize?: number;
}

export function useTransactionTablePagination({
  propCurrentPage,
  propPageSize,
  propTotalItems,
  propTotalPages,
  onPageChange,
  onPageSizeChange,
  itemsCount,
  defaultPage = 1,
  defaultPageSize = 10,
}: UseTransactionTablePaginationParams) {
  const isControlledPagination = onPageChange !== undefined;

  const [internalPage, setInternalPage] = useState<number>(defaultPage);
  const [internalPageSize, setInternalPageSize] = useState<number>(defaultPageSize);

  const activePage = isControlledPagination ? (propCurrentPage ?? 1) : internalPage;
  const activePageSize = isControlledPagination ? (propPageSize ?? 10) : internalPageSize;

  const handlePageChange = (page: number) => {
    if (isControlledPagination && onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isControlledPagination && onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
      setInternalPage(1);
    }
  };

  const effectiveTotalItems = propTotalItems ?? itemsCount;
  const effectiveTotalPages =
    propTotalPages ?? Math.ceil(effectiveTotalItems / activePageSize);

  return {
    isControlledPagination,
    activePage,
    activePageSize,
    effectiveTotalItems,
    effectiveTotalPages,
    handlePageChange,
    handlePageSizeChange,
  };
}

