import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Plus } from "lucide-react";
import { PageHeader, Button } from "@/shared/components/ui";
import { useTransactionsTableData, useTransactionDialogs } from "../hooks";
import {
  TransactionStatsCards,
  TransactionFilterBar,
  TransactionTable,
  TransactionDialogs,
} from "../components";

export function TransactionsPage() {
  const navigate = useNavigate();

  // 1. Hook especializado para datos de tabla, sincronización con URL, filtros, orden y paginación
  const {
    transactions,
    isLoading,
    stats,
    warehouses,
    searchTerm,
    typeFilter,
    statusFilter,
    warehouseFilter,
    page,
    pageSize,
    totalItems,
    totalPages,
    sortBy,
    sortOrder,
    setPage,
    setPageSize,
    setSort,
    setSearch,
    setTypeFilter,
    setStatusFilter,
    setWarehouseFilter,
    resetFilters,
    updateTransaction,
  } = useTransactionsTableData();

  // 2. Hook especializado para manejo de modales (detalle y confirmación de anulación)
  const {
    selectedTx,
    cancellingTx,
    isCancelling,
    openDetails,
    closeDetails,
    openCancel,
    closeCancel,
    confirmCancel,
  } = useTransactionDialogs({
    onUpdateTransaction: updateTransaction,
  });

  return (
    <div className="max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Movimientos y Transacciones de Inventario"
        description="Gestione recepciones, despachos, transferencias entre almacenes y ajustes de existencias."
        icon={
          <ArrowLeftRight className="w-6 h-6 text-[var(--color-sage-600)]" />
        }
      >
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate("/inventory/transactions/new")}
        >
          Registrar Movimiento
        </Button>
      </PageHeader>

      <TransactionStatsCards stats={stats} />

      <TransactionFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        warehouses={warehouses}
        onResetFilters={resetFilters}
      />

      <TransactionTable
        transactions={transactions}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSort}
        currentPage={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onViewDetails={openDetails}
        onEdit={(tx) => navigate(`/inventory/transactions/${tx.id}/edit`)}
        onCancelTx={openCancel}
      />

      <TransactionDialogs
        selectedTx={selectedTx}
        onCloseDetails={closeDetails}
        cancellingTx={cancellingTx}
        onCloseCancel={closeCancel}
        onConfirmCancel={confirmCancel}
        isCancelling={isCancelling}
      />
    </div>
  );
}

export default TransactionsPage;
