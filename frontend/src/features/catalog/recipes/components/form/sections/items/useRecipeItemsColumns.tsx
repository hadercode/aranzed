import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { useRecipeFormContext } from "../../../../context";
import {
  RecipeItemTypeBadge,
  RecipeItemUomBadge,
  RecipeItemSubtotalCell,
} from "./RecipeItemCells";
import type { Column } from "@/shared/components/ui";

export function useRecipeItemsColumns() {
  const {
    form,
    itemFields,
    removeItem,
    handleComponentSelect,
    componentProductOptions,
    productsMap,
  } = useRecipeFormContext();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const columns: Column<(typeof itemFields)[number]>[] = useMemo(
    () => [
      {
        key: "index",
        title: "#",
        align: "center",
        className: "w-10 text-xs font-mono",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <span className="text-[var(--color-text-muted)] font-mono text-xs">
              {index + 1}
            </span>
          );
        },
      },
      {
        key: "product",
        title: "Componente / Servicio",
        className: "min-w-[220px]",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const itemError = errors.items?.[index]?.productId;
          return (
            <div>
              <select
                {...register(`items.${index}.productId` as const)}
                onChange={(e) => handleComponentSelect(index, e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all cursor-pointer ${
                  itemError
                    ? "border-destructive"
                    : "border-[var(--color-border)]"
                }`}
              >
                <option value="">-- Selecciona insumo/servicio --</option>
                {componentProductOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (
                    {p.type === "RAW_MATERIAL"
                      ? "Mat. Prima"
                      : p.type === "SERVICE"
                        ? "Mano de Obra"
                        : "Producto"}{" "}
                    - {p.uom?.code || "UND"})
                  </option>
                ))}
              </select>
              {itemError && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {itemError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "type",
        title: "Tipo",
        align: "center",
        className: "w-28",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <RecipeItemTypeBadge
              control={control}
              index={index}
              productsMap={productsMap}
            />
          );
        },
      },
      {
        key: "quantity",
        title: "Cantidad",
        className: "w-32",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const qtyError = errors.items?.[index]?.quantity;
          return (
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="1.0"
                  {...register(`items.${index}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                  className={`w-full px-2 py-1.5 pr-8 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all ${
                    qtyError
                      ? "border-destructive"
                      : "border-[var(--color-border)]"
                  }`}
                />
                <RecipeItemUomBadge
                  control={control}
                  index={index}
                  productsMap={productsMap}
                />
              </div>
              {qtyError && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {qtyError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "unitCost",
        title: "Costo Unit. ($)",
        className: "w-32",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const costError = errors.items?.[index]?.unitCost;
          return (
            <div>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-muted)]">
                  $
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  {...register(`items.${index}.unitCost` as const, {
                    valueAsNumber: true,
                  })}
                  className={`w-full pl-5 pr-2 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all ${
                    costError
                      ? "border-destructive"
                      : "border-[var(--color-border)]"
                  }`}
                />
              </div>
              {costError && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {costError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "subtotal",
        title: "Subtotal ($)",
        align: "right",
        className: "w-28 font-mono font-semibold",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <RecipeItemSubtotalCell control={control} index={index} />;
        },
      },
      {
        key: "notes",
        title: "Notas",
        className: "min-w-[140px]",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <input
              type="text"
              placeholder="Ej: Medida corte, operario..."
              {...register(`items.${index}.notes` as const)}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all placeholder-[var(--color-text-muted)]"
            />
          );
        },
      },
      {
        key: "actions",
        title: "",
        align: "center",
        className: "w-10",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <button
              type="button"
              onClick={() => removeItem(index)}
              title="Eliminar fila"
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          );
        },
      },
    ],
    [
      itemFields,
      errors.items,
      register,
      control,
      handleComponentSelect,
      componentProductOptions,
      productsMap,
      removeItem,
    ],
  );

  return { columns, itemFields };
}
