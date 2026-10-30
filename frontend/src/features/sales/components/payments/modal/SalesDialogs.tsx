import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { useSalesContext } from "../../../context";
import { SalePreviewModal } from "./SalePreviewModal";
import { QuickPaymentModal } from "./QuickPaymentModal";
import { CloseSaleManualModal } from "./CloseSaleManualModal";
import { SalePaymentsHistoryModal } from "./SalePaymentsHistoryModal";
import { SaleWhatsAppReminderModal } from "./SaleWhatsAppReminderModal";

export function SalesDialogs() {
  const {
    previewSaleTarget,
    setPreviewSaleTarget,
    confirmSaleTarget,
    setConfirmSaleTarget,
    handleConfirmSale,
    isChangingStatus,
    convertQuotationTarget,
    setConvertQuotationTarget,
    handleConvertQuotation,
    isConverting,
    cancelSaleTarget,
    setCancelSaleTarget,
    cancelReason,
    setCancelReason,
    handleCancelSale,
    deleteSaleTarget,
    setDeleteSaleTarget,
    handleDeleteSale,
    isDeleting,
    actionError,
    setActionError,
    handlePrintSale,
    quickPaymentTarget,
    setQuickPaymentTarget,
    closeManualTarget,
    setCloseManualTarget,
    paymentsHistoryTarget,
    setPaymentsHistoryTarget,
    whatsAppSaleTarget,
    setWhatsAppSaleTarget,
    handlePaymentSuccess,
  } = useSalesContext();

  return (
    <>
      {/* 1. Modal de Vista Previa e Impresión */}
      <SalePreviewModal
        sale={previewSaleTarget}
        onClose={() => setPreviewSaleTarget(null)}
        onPrint={(sale) => handlePrintSale(sale)}
        onWhatsAppReminder={(sale) => setWhatsAppSaleTarget(sale)}
      />

      {/* 2. Diálogo Confirmar Venta -> COMPLETED */}
      <ConfirmDialog
        isOpen={Boolean(confirmSaleTarget)}
        title="Confirmar y Completar Venta"
        message={
          <div className="space-y-2 text-sm">
            <p>
              ¿Deseas marcar la venta{" "}
              <strong className="text-[var(--color-text-primary)]">
                #{confirmSaleTarget?.saleNumber}
              </strong>{" "}
              para el cliente{" "}
              <strong className="text-[var(--color-text-primary)]">
                "{confirmSaleTarget?.customerName}"
              </strong>{" "}
              como{" "}
              <span className="text-emerald-600 font-bold">COMPLETADA</span>?
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              Al confirmar, el sistema emitirá el evento desacoplado{" "}
              <code>SaleCompletedEvent</code> para que el módulo de Inventario
              descuente el stock de productos terminados o insumos por receta.
            </p>
          </div>
        }
        confirmText="Confirmar Venta"
        cancelText="Volver"
        variant="info"
        loading={isChangingStatus}
        onConfirm={handleConfirmSale}
        onClose={() => setConfirmSaleTarget(null)}
      />

      {/* 3. Diálogo Convertir Cotización a Venta Directa */}
      <ConfirmDialog
        isOpen={Boolean(convertQuotationTarget)}
        title="Convertir Cotización en Venta Directa"
        message={
          <div className="space-y-2 text-sm">
            <p>
              ¿Deseas transformar la cotización{" "}
              <strong className="text-[var(--color-text-primary)]">
                #{convertQuotationTarget?.saleNumber}
              </strong>{" "}
              en una venta comercial definitiva?
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Se generará un nuevo correlativo de venta directa (VEN-XXXX),
              manteniendo el enlace histórico con la cotización.
            </p>
          </div>
        }
        confirmText="Convertir a Venta"
        cancelText="Cancelar"
        variant="info"
        loading={isConverting}
        onConfirm={handleConvertQuotation}
        onClose={() => setConvertQuotationTarget(null)}
      />

      {/* 4. Diálogo Anular Venta */}
      <ConfirmDialog
        isOpen={Boolean(cancelSaleTarget)}
        title="Anular Documento de Venta"
        message={
          <div className="space-y-3 text-sm">
            <p>
              ¿Estás seguro de anular la venta / cotización{" "}
              <strong className="text-rose-600">
                #{cancelSaleTarget?.saleNumber}
              </strong>
              ? Esta acción es irreversible.
            </p>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Motivo de la anulación (opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. Desistimiento del cliente, error en precio..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        }
        confirmText="Sí, Anular Documento"
        cancelText="Cancelar"
        variant="danger"
        loading={isChangingStatus}
        onConfirm={handleCancelSale}
        onClose={() => {
          setCancelSaleTarget(null);
          setCancelReason("");
        }}
      />

      {/* 5. Diálogo Eliminar Borrador */}
      <ConfirmDialog
        isOpen={Boolean(deleteSaleTarget)}
        title="Eliminar Registro de Venta"
        message={`¿Deseas eliminar permanentemente el borrador #${deleteSaleTarget?.saleNumber}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteSale}
        onClose={() => setDeleteSaleTarget(null)}
      />

      {/* 6. Modal de Cobro / Abono Directo */}
      <QuickPaymentModal
        isOpen={Boolean(quickPaymentTarget)}
        sale={quickPaymentTarget}
        onClose={() => setQuickPaymentTarget(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* 7. Modal de Cierre Manual con Ajuste de Diferencia */}
      <CloseSaleManualModal
        isOpen={Boolean(closeManualTarget)}
        sale={closeManualTarget}
        onClose={() => setCloseManualTarget(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* 8. Modal de Historial de Pagos de la Venta */}
      <SalePaymentsHistoryModal
        isOpen={Boolean(paymentsHistoryTarget)}
        sale={paymentsHistoryTarget}
        onClose={() => setPaymentsHistoryTarget(null)}
        onOpenQuickPayment={(sale) => setQuickPaymentTarget(sale)}
      />

      {/* 9. Modal de Notificación de Cobro por WhatsApp */}
      <SaleWhatsAppReminderModal
        isOpen={Boolean(whatsAppSaleTarget)}
        sale={whatsAppSaleTarget}
        onClose={() => setWhatsAppSaleTarget(null)}
      />

      {/* Banner de Error en Acción */}
      {actionError && (
        <div className="fixed bottom-6 right-6 max-w-md bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl shadow-xl z-50 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-5">
          <p className="text-sm font-medium">{actionError}</p>
          <button
            onClick={() => setActionError(null)}
            className="text-rose-400 hover:text-rose-600 font-bold text-sm shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export default SalesDialogs;
