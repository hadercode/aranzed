import { useSalesContext } from "../../context";
import { useSalesTableColumns } from "../../hooks/logic/useSalesTableColumns";
import type { Sale } from "../../types";
import { DataTable } from "@/shared/components/ui";

export function SalesTable() {
  const {
    sales,
    isLoading,
    setPreviewSaleTarget,
    handlePrintSale,
    handleEditSale,
    setConfirmSaleTarget,
    setConvertQuotationTarget,
    setCancelSaleTarget,
    setDeleteSaleTarget,
    handleUpdatePaidStatus,
    setQuickPaymentTarget,
    setCloseManualTarget,
    setPaymentsHistoryTarget,
  } = useSalesContext();

  const columns = useSalesTableColumns({
    onPreview: (sale: Sale) => setPreviewSaleTarget(sale),
    onPrint: (sale: Sale) => handlePrintSale(sale),
    onEdit: (id: string) => handleEditSale(id),
    onConfirm: (sale: Sale) => setConfirmSaleTarget(sale),
    onConvert: (sale: Sale) => setConvertQuotationTarget(sale),
    onCancel: (sale: Sale) => setCancelSaleTarget(sale),
    onDelete: (sale: Sale) => setDeleteSaleTarget(sale),
    onUpdatePaidStatus: (sale: Sale, newStatus) =>
      handleUpdatePaidStatus(sale, newStatus),
    onOpenQuickPayment: (sale: Sale) => setQuickPaymentTarget(sale),
    onOpenCloseManual: (sale: Sale) => setCloseManualTarget(sale),
    onOpenPaymentsHistory: (sale: Sale) => setPaymentsHistoryTarget(sale),
  });

  return (
    <div className="space-y-4">
      <DataTable<Sale>
        columns={columns}
        data={sales}
        loading={isLoading}
        emptyMessage="No se encontraron ventas o cotizaciones registradas"
        rowKey={(s) => s.id}
      />
    </div>
  );
}

export default SalesTable;
