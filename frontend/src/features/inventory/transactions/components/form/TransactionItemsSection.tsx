import { Plus, Package, Layers } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { TransactionItemsTable } from "./TransactionItemsTable";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

interface TransactionItemsSectionProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionItemsSection({
  formContext,
}: TransactionItemsSectionProps) {
  const { items, addItem, isEditMode } = formContext;

  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
      {/* Header de la sección */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Productos y Renglones de Movimiento
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              {items.length} {items.length === 1 ? "renglón" : "renglones"}{" "}
              configurados en este movimiento
            </p>
          </div>
        </div>

        {!isEditMode && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={addItem}
          >
            Agregar Producto
          </Button>
        )}
      </div>

      {/* Estado vacío o tabla de renglones */}
      {items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-bg)] space-y-3">
          <Layers className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">
            No hay productos agregados a este movimiento
          </p>
          <Button type="button" size="sm" onClick={addItem}>
            + Agregar Primer Producto
          </Button>
        </div>
      ) : (
        <TransactionItemsTable formContext={formContext} />
      )}
    </div>
  );
}

export default TransactionItemsSection;

