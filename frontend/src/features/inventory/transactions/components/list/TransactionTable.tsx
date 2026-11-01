import { ArrowLeftRight } from "lucide-react";
import { DataTable } from "@/shared/components/ui";
import type { InventoryTransaction } from "../../types";
import { useTransactionColumns } from "../columns/useTransactionColumns";
import { useTransactionTable } from "../../hooks/logic/useTransactionTable";

export interface TransactionTableProps {
  transactions: InventoryTransaction[];
  isLoading: boolean;
  onViewDetails: (tx: InventoryTransaction) => void;
  onCancelTx: (tx: InventoryTransaction) => void;
  onEdit?: (tx: InventoryTransaction) => void;

  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  onSortChange?: (field: string, order: "asc" | "desc" | null) => void;

  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  onViewDetails,
  onCancelTx,
  onEdit,
  sortBy,
  sortOrder,
  onSortChange,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TransactionTableProps) {
  const {
    processedData,
    activeSortBy,
    activeSortOrder,
    handleSortChange,
    activePage,
    activePageSize,
    effectiveTotalItems,
    effectiveTotalPages,
    handlePageChange,
    handlePageSizeChange,
  } = useTransactionTable({
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
  });

  const columns = useTransactionColumns({ onViewDetails, onCancelTx, onEdit });

  return (
    <DataTable
      columns={columns}
      data={processedData}
      loading={isLoading}
      sortBy={activeSortBy}
      sortOrder={activeSortOrder}
      onSortChange={handleSortChange}
      currentPage={activePage}
      pageSize={activePageSize}
      totalItems={effectiveTotalItems}
      totalPages={effectiveTotalPages}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      emptyContent={
        <div className="py-12 text-center text-[var(--color-text-secondary)]">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30 text-[var(--color-text-muted)]" />
          <p className="font-medium text-base text-[var(--color-text-primary)]">
            No se encontraron movimientos
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Prueba ajustando los filtros de búsqueda o registra una nueva
            transacción.
          </p>
        </div>
      }
    />
  );
}

export default TransactionTable;
