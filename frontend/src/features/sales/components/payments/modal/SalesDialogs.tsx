import { useSalesPage } from '../../../hooks';
import { SalePreviewModal } from './SalePreviewModal';
import { QuickPaymentModal } from './QuickPaymentModal';
import { CloseSaleManualModal } from './CloseSaleManualModal';
import { SalePaymentsHistoryModal } from './SalePaymentsHistoryModal';
import { SaleWhatsAppReminderModal } from './SaleWhatsAppReminderModal';
import { SaleStateConfirmDialogs } from './SaleStateConfirmDialogs';

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
  } = useSalesPage();

  return (
    <>
      <SalePreviewModal
        sale={previewSaleTarget}
        onClose={() => setPreviewSaleTarget(null)}
        onPrint={(sale) => handlePrintSale(sale)}
        onWhatsAppReminder={(sale) => setWhatsAppSaleTarget(sale)}
      />

      <SaleStateConfirmDialogs
        confirmSaleTarget={confirmSaleTarget}
        setConfirmSaleTarget={setConfirmSaleTarget}
        handleConfirmSale={handleConfirmSale}
        isChangingStatus={isChangingStatus}
        convertQuotationTarget={convertQuotationTarget}
        setConvertQuotationTarget={setConvertQuotationTarget}
        handleConvertQuotation={handleConvertQuotation}
        isConverting={isConverting}
        cancelSaleTarget={cancelSaleTarget}
        setCancelSaleTarget={setCancelSaleTarget}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelSale={handleCancelSale}
        deleteSaleTarget={deleteSaleTarget}
        setDeleteSaleTarget={setDeleteSaleTarget}
        handleDeleteSale={handleDeleteSale}
        isDeleting={isDeleting}
      />

      <QuickPaymentModal
        isOpen={Boolean(quickPaymentTarget)}
        sale={quickPaymentTarget}
        onClose={() => setQuickPaymentTarget(null)}
        onSuccess={handlePaymentSuccess}
      />

      <CloseSaleManualModal
        isOpen={Boolean(closeManualTarget)}
        sale={closeManualTarget}
        onClose={() => setCloseManualTarget(null)}
        onSuccess={handlePaymentSuccess}
      />

      <SalePaymentsHistoryModal
        isOpen={Boolean(paymentsHistoryTarget)}
        sale={paymentsHistoryTarget}
        onClose={() => setPaymentsHistoryTarget(null)}
        onOpenQuickPayment={(sale) => setQuickPaymentTarget(sale)}
      />

      <SaleWhatsAppReminderModal
        isOpen={Boolean(whatsAppSaleTarget)}
        sale={whatsAppSaleTarget}
        onClose={() => setWhatsAppSaleTarget(null)}
      />

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
