import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { usePurchaseFormContext } from "../../context";
import {
  PurchaseItemUnitCostCell,
  PurchaseItemSubtotalCell,
  PurchaseItemTotalCell,
  PurchaseItemTaxCell,
} from "../../components/form/sections/items/PurchaseItemCells";
import type { Column } from "@/shared/components/ui";
import { useCurrencyStore } from "@/shared/hooks/store";

export function usePurchaseItemsColumns() {
  const { form, formItems, rawMaterials } = usePurchaseFormContext();

  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const {
    itemFields,
    removeItem,
    handleMaterialSelect,
    handleToggleTaxable,
    handleQuantityChange,
    handleUnitCostChange,
    handleSubtotalChange,
  } = formItems;

  const watchedDoc = watch("documentCurrency") || functionalCurrency;
  const watchedLocal = watch("localCurrency") || localCurrency;
  const isDocLocal = watchedDoc === watchedLocal;

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
        key: "materialId",
        title: "Material del Catálogo",
        className: "min-w-[220px]",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const itemError = (errors.items as any)?.[index]?.materialId;

          return (
            <div>
              <select
                {...register(`items.${index}.materialId` as const)}
                onChange={(e) => handleMaterialSelect(index, e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer ${
                  itemError ? "border-rose-500" : "border-[var(--color-border)]"
                }`}
              >
                <option value="">-- Seleccionar Material --</option>
                {rawMaterials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} {mat.uom ? `(${mat.uom.code})` : ""} - Últ.
                    Costo: {functionalSymbol}
                    {Number(mat.lastCost).toFixed(2)}
                  </option>
                ))}
              </select>
              {itemError && (
                <p className="text-[10px] text-rose-500 mt-0.5 font-medium">
                  {itemError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "description",
        title: "Descripción en Factura",
        className: "min-w-[180px]",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const itemError = (errors.items as any)?.[index]?.description;

          return (
            <div>
              <input
                type="text"
                placeholder="Descripción del ítem..."
                {...register(`items.${index}.description` as const)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                  itemError ? "border-rose-500" : "border-[var(--color-border)]"
                }`}
              />
              {itemError && (
                <p className="text-[10px] text-rose-500 mt-0.5 font-medium">
                  {itemError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "quantity",
        title: "Cantidad",
        className: "w-24",
        align: "right",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const qtyError = (errors.items as any)?.[index]?.quantity;

          return (
            <div>
              <input
                type="number"
                step="any"
                min="0.0001"
                placeholder="1.0"
                {...register(`items.${index}.quantity` as const, {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const parsed = parseFloat(e.target.value) || 0;
                    handleQuantityChange(index, parsed);
                  },
                })}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono text-right bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                  qtyError ? "border-rose-500" : "border-[var(--color-border)]"
                }`}
              />
              {qtyError && (
                <p className="text-[10px] text-rose-500 mt-0.5 font-medium text-right">
                  {qtyError.message}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "unitCost",
        title: isDocLocal
          ? `Costo Unit. (${localSymbol})`
          : `Costo Unit. (${functionalSymbol})`,
        className: "w-36",
        align: "right",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const costError = (errors.items as any)?.[index]?.unitCost;

          return (
            <PurchaseItemUnitCostCell
              control={control}
              index={index}
              onUnitCostChange={handleUnitCostChange}
              error={costError}
            />
          );
        },
      },
      {
        key: "subtotal",
        title: isDocLocal
          ? `Subtotal (${localSymbol})`
          : `Subtotal (${functionalSymbol})`,
        align: "right",
        className: "w-36",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          const subtotalError = (errors.items as any)?.[index]?.subtotal;

          return (
            <PurchaseItemSubtotalCell
              control={control}
              index={index}
              onSubtotalChange={handleSubtotalChange}
              error={subtotalError}
            />
          );
        },
      },
      {
        key: "isTaxable",
        title: "IVA (16%)",
        align: "center",
        className: "w-24",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <PurchaseItemTaxCell
              control={control}
              index={index}
              onToggleTaxable={handleToggleTaxable}
            />
          );
        },
      },
      {
        key: "total",
        title: `Total (${functionalSymbol} / ${localSymbol})`,
        align: "right",
        className: "w-32 font-mono font-bold",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <PurchaseItemTotalCell control={control} index={index} />;
        },
      },
      {
        key: "actions",
        title: "",
        align: "center",
        className: "w-10",
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          if (itemFields.length <= 1) return null;

          return (
            <button
              type="button"
              onClick={() => removeItem(index)}
              title="Eliminar este material"
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
      handleMaterialSelect,
      handleToggleTaxable,
      handleQuantityChange,
      handleUnitCostChange,
      handleSubtotalChange,
      rawMaterials,
      removeItem,
      isDocLocal,
      functionalSymbol,
      localSymbol,
    ],
  );

  return { columns, itemFields };
}
