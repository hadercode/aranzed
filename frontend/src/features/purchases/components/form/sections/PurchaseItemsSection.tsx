import { Layers, Plus, AlertCircle } from "lucide-react";
import { usePurchaseFormContext } from "../../../context";
import { SectionHeader } from "@/shared/components/ui";
import { PurchaseItemsEmptyState, PurchaseItemsTable } from "./items";

export function PurchaseItemsSection() {
  const { form, formItems } = usePurchaseFormContext();
  const {
    formState: { errors },
  } = form;
  const { itemFields, handleAddNewItem } = formItems;

  const itemsErrorMessage =
    errors.items && typeof errors.items.message === "string"
      ? errors.items.message
      : null;

  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
      {/* Header & Actions */}
      <SectionHeader
        icon={<Layers className="w-4 h-4" />}
        title="Detalle de Materiales Comprados"
        description="Materias primas, cantidades, costo unitario y tratamiento de IVA (16% por defecto)"
        action={{
          label: "Agregar Material",
          onClick: () => handleAddNewItem(),
          icon: <Plus className="w-3.5 h-3.5" />,
          variant: "outline",
          size: "sm",
        }}
      />

      {/* Error alert */}
      {itemsErrorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{itemsErrorMessage}</span>
        </div>
      )}

      {/* Subcomponents: Empty State vs Items Table */}
      {itemFields.length === 0 ? (
        <PurchaseItemsEmptyState />
      ) : (
        <PurchaseItemsTable />
      )}
    </div>
  );
}

export default PurchaseItemsSection;
