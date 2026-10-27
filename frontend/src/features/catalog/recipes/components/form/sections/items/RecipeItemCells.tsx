import { useWatch, type Control } from "react-hook-form";
import { Hammer, Boxes } from "lucide-react";
import type { RecipeFormData } from "../../../../schemas/recipe.schema";
import type { Product } from "@/features/catalog/products/types";

export function RecipeItemTypeBadge({
  control,
  index,
  productsMap,
}: {
  control: Control<RecipeFormData>;
  index: number;
  productsMap: Map<string, Product>;
}) {
  const productId = useWatch({
    control,
    name: `items.${index}.productId`,
  });
  const p = productId ? productsMap.get(productId) : undefined;

  if (p?.type === "SERVICE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        <Hammer className="w-3 h-3" />
        Mano Obra
      </span>
    );
  }
  if (p?.type === "RAW_MATERIAL") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <Boxes className="w-3 h-3" />
        Mat. Prima
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border border-[var(--color-border)]">
      Insumo
    </span>
  );
}

export function RecipeItemUomBadge({
  control,
  index,
  productsMap,
}: {
  control: Control<RecipeFormData>;
  index: number;
  productsMap: Map<string, Product>;
}) {
  const productId = useWatch({
    control,
    name: `items.${index}.productId`,
  });
  const p = productId ? productsMap.get(productId) : undefined;
  return (
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
      {p?.uom?.code || "UND"}
    </span>
  );
}

export function RecipeItemSubtotalCell({
  control,
  index,
}: {
  control: Control<RecipeFormData>;
  index: number;
}) {
  const row = useWatch({
    control,
    name: `items.${index}`,
  });
  const qty = Number(row?.quantity) || 0;
  const unit = Number(row?.unitCost) || 0;
  const lineSubtotal = qty * unit;

  return (
    <span className="text-[var(--color-text-primary)]">
      ${lineSubtotal.toFixed(2)}
    </span>
  );
}
