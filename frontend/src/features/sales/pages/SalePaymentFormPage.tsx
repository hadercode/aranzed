import { useSalePaymentFormPage } from '../hooks/logic/useSalePaymentFormPage';
import {
  SalePaymentFormHeader,
  CustomerSelectSection,
  PaymentAmountSection,
  PaymentDetailsSection,
  PaymentReceiptSection,
  PendingSalesAllocationSection,
  SalePaymentStickyBar,
  SalePaymentFormFeedback,
} from '../components/payments/form';

export function SalePaymentFormPage() {
  const form = useSalePaymentFormPage();

  return (
    <form
      id="sale-payment-cross-form"
      onSubmit={form.handleSubmit}
      noValidate
      className="max-w-7xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      {/* Cabecera y Botones Superiores */}
      <SalePaymentFormHeader
        onCancel={form.handleCancel}
        onSubmit={form.handleSubmit}
        isSubmitting={form.isSubmitting}
      />

      {/* Banner de Feedback de Errores */}
      <SalePaymentFormFeedback error={form.error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Cliente y Ventas Pendientes */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerSelectSection
            customerName={form.customerName}
            onCustomerNameChange={form.setCustomerName}
            customerTaxId={form.customerTaxId}
            onCustomerTaxIdChange={form.setCustomerTaxId}
            pendingSalesCount={form.pendingSales.length}
            isLoadingPending={form.isLoadingPending}
          />

          <PendingSalesAllocationSection
            pendingSales={form.pendingSales}
            isLoadingPending={form.isLoadingPending}
            allocations={form.allocations}
            totalAmountUsd={form.totalAmountUsd}
            totalAllocatedUsd={form.totalAllocatedUsd}
            remainingToAllocateUsd={form.remainingToAllocateUsd}
            onAllocationChange={form.handleAllocationChange}
            onToggleCloseDiff={form.handleToggleCloseDiff}
            onAutoDistribute={form.handleAutoDistribute}
            onClearAllocations={form.handleClearAllocations}
            onFillMaxForSale={form.handleFillMaxForSale}
          />
        </div>

        {/* Columna Derecha (1/3): Monto, Transacción y Comprobante */}
        <div className="space-y-6">
          <PaymentAmountSection
            currency={form.currency}
            onCurrencyChange={form.setCurrency}
            totalPaymentAmount={form.totalPaymentAmount}
            onTotalPaymentAmountChange={form.setTotalPaymentAmount}
            exchangeRate={form.exchangeRate}
            onExchangeRateChange={form.setExchangeRate}
            totalAmountUsd={form.totalAmountUsd}
            totalAmountVes={form.totalAmountVes}
          />

          <PaymentDetailsSection
            paymentMethod={form.paymentMethod}
            onPaymentMethodChange={form.setPaymentMethod}
            paymentDate={form.paymentDate}
            onPaymentDateChange={form.setPaymentDate}
            reference={form.reference}
            onReferenceChange={form.setReference}
            notes={form.notes}
            onNotesChange={form.setNotes}
          />

          <PaymentReceiptSection
            receiptUrl={form.receiptUrl}
            receiptFileName={form.receiptFileName}
            isUploading={form.isUploading}
            onFileUpload={form.handleFileUpload}
            onRemoveReceipt={form.handleRemoveReceipt}
          />
        </div>
      </div>

      {/* Barra de Acciones Flotante Inferior */}
      <SalePaymentStickyBar
        totalAmountUsd={form.totalAmountUsd}
        totalAllocatedUsd={form.totalAllocatedUsd}
        remainingToAllocateUsd={form.remainingToAllocateUsd}
        isSubmitting={form.isSubmitting}
        onCancel={form.handleCancel}
        onSubmit={form.handleSubmit}
      />
    </form>
  );
}

export default SalePaymentFormPage;
