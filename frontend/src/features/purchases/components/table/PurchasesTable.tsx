import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { usePurchasesContext } from "../../context";
import { Button, DataTable } from "@/shared/components/ui";
import { usePurchasesTableColumns } from "../../hooks/logic/usePurchasesTableColumns";

export function PurchasesTable() {
  const navigate = useNavigate();
  const {
    loading,
    paginatedPurchases,
    filteredPurchases,
    currentPage,
    pageSize,
    totalPages,
    sortBy,
    sortOrder,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  } = usePurchasesContext();

  const columns = usePurchasesTableColumns();

  return (
    <DataTable
      columns={columns}
      data={paginatedPurchases}
      loading={loading}
      loadingMessage="Cargando compras de materiales..."
      emptyContent={
        <div className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
            No se encontraron compras
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
            Aún no hay compras registradas o ninguna coincide con los filtros de
            búsqueda aplicados.
          </p>
          <Button variant="primary" onClick={() => navigate("/purchases/new")}>
            Registrar Primera Compra
          </Button>
        </div>
      }
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={filteredPurchases.length}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      maxPageButtons={10}
    />
  );
}

export default PurchasesTable;
