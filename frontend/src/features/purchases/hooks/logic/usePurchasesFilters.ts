import { useState, useMemo, useCallback } from 'react';
import type { Purchase, PurchaseStatus } from '../../types';

export function usePurchasesFilters(purchases: Purchase[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSearchChange = useCallback((val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((status: PurchaseStatus | 'ALL') => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      // Búsqueda por proveedor, correlativo o factura
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSupplier = item.supplierName.toLowerCase().includes(term);
        const matchesNumber = item.purchaseNumber.toLowerCase().includes(term);
        const matchesInvoice = item.invoiceNumber.toLowerCase().includes(term);
        if (!matchesSupplier && !matchesNumber && !matchesInvoice) {
          return false;
        }
      }

      // Filtro de estado
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [purchases, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / pageSize));

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPurchases.slice(start, start + pageSize);
  }, [filteredPurchases, currentPage, pageSize]);

  return {
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    totalPages,
    filteredPurchases,
    paginatedPurchases,
    handleSearchChange,
    handleStatusFilterChange,
    setCurrentPage,
  };
}
