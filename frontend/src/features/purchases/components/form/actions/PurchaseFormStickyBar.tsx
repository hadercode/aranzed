import { usePurchaseFormContext } from "../../../context";
import { StickyBar } from "@/shared/components/ui";
import { useCurrencyStore } from "@/shared/hooks/store";

export function PurchaseFormStickyBar() {
  const { form, breakdown, isMutating, handleCancel } =
    usePurchaseFormContext();
  const { functionalSymbol, localSymbol } = useCurrencyStore();
  const supplierName = form.watch("supplierName");
  const invoiceNumber = form.watch("invoiceNumber");

  return (
    <StickyBar
      subtitle="Comprobante:"
      title={
        <>
          {supplierName ? `${supplierName}` : "Nuevo Registro"}{" "}
          {invoiceNumber ? `(${invoiceNumber})` : ""}
        </>
      }
      leftContent={
        <div className="border-l border-[var(--color-border)] pl-3 sm:pl-4">
          <span className="text-xs text-[var(--color-text-muted)] block">
            Total Liquidación:
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {functionalSymbol}{" "}
              {breakdown.functional.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs sm:text-sm font-semibold font-mono text-blue-600 dark:text-blue-400">
              / {localSymbol}{" "}
              {breakdown.local.total.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      }
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitText="Guardar Compra"
      isSubmitting={isMutating}
    />
  );
}

export default PurchaseFormStickyBar;
