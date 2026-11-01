import { useMemo } from 'react';
import type { Purchase, PurchaseStatus } from '../../types';

export function usePurchasesFilterSort({
  purchases,
  searchTerm,
  statusFilter,
  sortBy,
  sortOrder,
  currentPage,
  pageSize,
}: {
  purchases: Purchase[];
  searchTerm: string;
  statusFilter: PurchaseStatus | 'ALL';
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  currentPage: number;
  pageSize: number;
}) {
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSupplier = item.supplierName.toLowerCase().includes(term);
        const matchesNumber = item.purchaseNumber.toLowerCase().includes(term);
        const matchesInvoice = item.invoiceNumber.toLowerCase().includes(term);
        if (!matchesSupplier && !matchesNumber && !matchesInvoice) {
          return false;
        }
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [purchases, searchTerm, statusFilter]);

  const sortedPurchases = useMemo(() => {
    if (!sortBy || !sortOrder) return filteredPurchases;

    return [...filteredPurchases].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortBy];
      const bVal = (b as unknown as Record<string, unknown>)[sortBy];

      if (sortBy === 'purchaseDate') {
        const aTime = new Date(aVal as string).getTime();
        const bTime = new Date(bVal as string).getTime();
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (
        sortBy === 'total' ||
        sortBy === 'subtotal' ||
        sortBy === 'exchangeRate' ||
        sortBy === 'taxAmount'
      ) {
        const aNum = Number(aVal) || 0;
        const bNum = Number(bVal) || 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filteredPurchases, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedPurchases.length / pageSize));

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPurchases.slice(start, start + pageSize);
  }, [sortedPurchases, currentPage, pageSize]);

  return {
    filteredPurchases,
    sortedPurchases,
    paginatedPurchases,
    totalPages,
  };
}

