import { StickyBar } from "@/shared/components/ui";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

interface TransactionFormStickyBarProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionFormStickyBar({
  formContext,
}: TransactionFormStickyBarProps) {
  const {
    txType,
    metrics,
    functionalSymbol,
    isMutating,
    handleCancel,
    isEditMode,
  } = formContext;

  const typeLabels: Record<string, string> = {
    RECEPTION: "Recepción de Mercancía",
    ISSUE: "Salida / Consumo",
    TRANSFER: "Transferencia de Almacén",
    ADJUSTMENT: "Ajuste de Inventario",
  };

  return (
    <StickyBar
      subtitle="Movimiento:"
      title={typeLabels[txType] || "Movimiento de Inventario"}
      leftContent={
        <div className="border-l border-[var(--color-border)] pl-3 sm:pl-4">
          <span className="text-xs text-[var(--color-text-muted)] block">
            Resumen Total:
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
              {metrics.totalItems} {metrics.totalItems === 1 ? "ítem" : "ítems"}{" "}
              ({metrics.totalQuantity.toFixed(2)} uds)
            </span>
            {txType === "RECEPTION" && (
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                / {functionalSymbol}{" "}
                {metrics.totalEstimatedCostUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </div>
      }
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitFormId="inventory-transaction-form"
      submitText={isEditMode ? "Guardar Cambios" : "Registrar Movimiento"}
      isSubmitting={isMutating}
    />
  );
}
