import { useSalePaymentFormPage } from "../hooks/logic/useSalePaymentFormPage";
import {
  SalePaymentFormHeader,
  CustomerSelectSection,
  PaymentAmountSection,
  PaymentDetailsSection,
  PaymentReceiptSection,
  PendingSalesAllocationSection,
  SalePaymentStickyBar,
  SalePaymentFormFeedback,
} from "../components/payments/form";

export function SalePaymentFormPage() {
  const form = useSalePaymentFormPage();

  return (
    <form
      id="sale-payment-cross-form"
      onSubmit={form.handleSubmit}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-5 animate-in fade-in duration-300"
    >
      {/* Cabecera y Botones Superiores */}
      <SalePaymentFormHeader
        onCancel={form.handleCancel}
        onSubmit={form.handleSubmit}
        isSubmitting={form.isSubmitting}
      />

      {/* Banner de Feedback de Errores */}
      <SalePaymentFormFeedback error={form.error} />

      {/* 1. Cliente y Documento (Ancho Completo) */}
      <CustomerSelectSection
        customerName={form.customerName}
        onCustomerNameChange={form.setCustomerName}
        customerTaxId={form.customerTaxId}
        onCustomerTaxIdChange={form.setCustomerTaxId}
        pendingSalesCount={form.pendingSales.length}
        isLoadingPending={form.isLoadingPending}
      />

      {/* 2. Monto del Cobro y Moneda (Ancho Completo, Tipografía Grande y Clara) */}
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

      {/* 3. Detalles de la Transacción y Comprobante (Balanceado 8/4 en Laptop/Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 h-full">
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
        </div>

        <div className="lg:col-span-4 h-full">
          <PaymentReceiptSection
            receiptUrl={form.receiptUrl}
            receiptFileName={form.receiptFileName}
            isUploading={form.isUploading}
            onFileUpload={form.handleFileUpload}
            onRemoveReceipt={form.handleRemoveReceipt}
          />
        </div>
      </div>

      {/* 4. Ventas Pendientes y Cruce de Saldos (Ancho Completo para la Tabla) */}
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
