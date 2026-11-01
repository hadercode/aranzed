import { Boxes, Calculator } from "lucide-react";
import type { UseRecipeFormPageReturn } from "../../../hooks/logic/useRecipeFormPage";
import { StickyBar } from "@/shared/components/ui";

export interface RecipeFormStickyBarProps {
  formPage: UseRecipeFormPageReturn;
}

export function RecipeFormStickyBar({ formPage }: RecipeFormStickyBarProps) {
  const {
    isEditing,
    isMutating,
    itemFields,
    costBreakdown,
    handleCancel,
    selectedParentProduct,
  } = formPage;

  return (
    <StickyBar
      indicators={[
        {
          icon: (
            <Boxes className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ),
          value: `${itemFields.length} ${itemFields.length === 1 ? "componente" : "componentes"}`,
        },
        {
          icon: (
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ),
          label: "Costo BOM:",
          value: `$${costBreakdown.totalCost.toFixed(2)}`,
        },
        {
          label: "Costo Unitario:",
          value: `$${costBreakdown.unitCost.toFixed(2)} / ${selectedParentProduct?.uom?.code || "und"}`,
          highlight: true,
        },
      ]}
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitText={isEditing ? "Actualizar Receta" : "Guardar Receta"}
      isSubmitting={isMutating}
    />
  );
}

export default RecipeFormStickyBar;
