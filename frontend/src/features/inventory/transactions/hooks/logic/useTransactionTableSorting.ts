import { useState } from 'react';

export interface UseTransactionTableSortingParams {
  propSortBy?: string | null;
  propSortOrder?: 'asc' | 'desc' | null;
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;
  defaultSortBy?: string | null;
  defaultSortOrder?: 'asc' | 'desc' | null;
}

export function useTransactionTableSorting({
  propSortBy,
  propSortOrder,
  onSortChange,
  defaultSortBy = 'movementDate',
  defaultSortOrder = 'desc',
}: UseTransactionTableSortingParams) {
  const isControlledSort = onSortChange !== undefined;

  const [internalSortBy, setInternalSortBy] = useState<string | null>(defaultSortBy);
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc' | null>(defaultSortOrder);

  const activeSortBy = isControlledSort ? propSortBy : internalSortBy;
  const activeSortOrder = isControlledSort ? propSortOrder : internalSortOrder;

  const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
    if (isControlledSort && onSortChange) {
      onSortChange(field, order);
    } else {
      setInternalSortBy(field);
      setInternalSortOrder(order);
    }
  };

  return {
    isControlledSort,
    activeSortBy,
    activeSortOrder,
    handleSortChange,
  };
}

