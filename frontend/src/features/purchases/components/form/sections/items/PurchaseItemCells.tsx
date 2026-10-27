import { useState } from "react";
import { useWatch, type Control } from "react-hook-form";
import type { PurchaseFormData } from "../../../../schemas/purchase.schema";
import { useCurrencyStore } from "@/shared/hooks/store";

interface CellProps {
  control: Control<PurchaseFormData>;
  index: number;
}

/**
 * Celda de Costo Unitario con input adaptativo según la moneda del documento,
 * conversión reactiva y cálculo bidireccional hacia Subtotal.
 */
export function PurchaseItemUnitCostCell({
  control,
  index,
  onUnitCostChange,
  error,
}: CellProps & {
  onUnitCostChange: (index: number, cost: number) => void;
  error?: { message?: string };
}) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const cost =
    Number(
      useWatch({
        control,
        name: `items.${index}.unitCost`,
      }),
    ) || 0;

  const exchangeRate =
    Number(
      useWatch({
        control,
        name: "exchangeRate",
      }),
    ) || 1.0;

  const documentCurrency =
    useWatch({
      control,
      name: "documentCurrency",
    }) || functionalCurrency;

  const isDocLocal = documentCurrency === localCurrency;
  const primarySymbol = isDocLocal ? localSymbol : functionalSymbol;
  const convertedSymbol = isDocLocal ? functionalSymbol : localSymbol;
  const convertedLocale = isDocLocal ? "en-US" : "es-VE";

  const [localVal, setLocalVal] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  // Al estar enfocado se preserva lo que el usuario tipea; desenfocado muestra el valor limpio
  const displayVal = isFocused
    ? localVal
    : cost > 0
    ? String(Number(cost.toFixed(4)))
    : "";

  const handleFocus = () => {
    setIsFocused(true);
    setLocalVal(cost > 0 ? String(Number(cost.toFixed(4))) : "");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalVal(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0) {
      onUnitCostChange(index, parsed);
    } else if (text === "") {
      onUnitCostChange(index, 0);
    }
  };

  const equivalent = isDocLocal
    ? exchangeRate > 0
      ? cost / exchangeRate
      : 0
    : cost * exchangeRate;

  return (
    <div>
      <div className="relative">
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold ${
            isDocLocal
              ? "text-blue-600 dark:text-blue-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {primarySymbol}
        </span>
        <input
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={displayVal}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-xs font-mono text-right bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 ${
            isDocLocal ? "focus:ring-blue-500" : "focus:ring-emerald-500"
          } transition-all ${
            error ? "border-rose-500" : "border-[var(--color-border)]"
          }`}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
          ≈ {convertedSymbol}{" "}
          {equivalent.toLocaleString(convertedLocale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </span>
      </div>
      {error && (
        <p className="text-[10px] text-rose-500 mt-0.5 font-medium text-right">
          {error.message}
        </p>
      )}
    </div>
  );
}

/**
 * Celda de Subtotal con input editable bidireccional y conversión reactiva a la otra moneda.
 * Si el usuario coloca el subtotal (ej. 1.80 para 50 unidades), calcula automáticamente el costo unitario (0.036).
 */
export function PurchaseItemSubtotalCell({
  control,
  index,
  onSubtotalChange,
  error,
}: CellProps & {
  onSubtotalChange: (index: number, subtotal: number) => void;
  error?: { message?: string };
}) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const item = useWatch({
    control,
    name: `items.${index}`,
  });

  const exchangeRate =
    Number(
      useWatch({
        control,
        name: "exchangeRate",
      }),
    ) || 1.0;

  const documentCurrency =
    useWatch({
      control,
      name: "documentCurrency",
    }) || functionalCurrency;

  const isDocLocal = documentCurrency === localCurrency;
  const primarySymbol = isDocLocal ? localSymbol : functionalSymbol;
  const convertedSymbol = isDocLocal ? functionalSymbol : localSymbol;
  const convertedLocale = isDocLocal ? "en-US" : "es-VE";

  const qty = Number(item?.quantity) || 0;
  const costInput = Number(item?.unitCost) || 0;
  const subtotalPrimary =
    item?.subtotal !== undefined
      ? Number(item.subtotal)
      : Number((qty * costInput).toFixed(2));

  const [localVal, setLocalVal] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  // Al estar enfocado se preserva lo que el usuario tipea; desenfocado muestra el valor con 2 decimales
  const displayVal = isFocused
    ? localVal
    : subtotalPrimary > 0
    ? Number(subtotalPrimary).toFixed(2)
    : "";

  const handleFocus = () => {
    setIsFocused(true);
    setLocalVal(subtotalPrimary > 0 ? String(subtotalPrimary) : "");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalVal(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0) {
      onSubtotalChange(index, parsed);
    } else if (text === "") {
      onSubtotalChange(index, 0);
    }
  };

  const subtotalConverted = isDocLocal
    ? exchangeRate > 0
      ? subtotalPrimary / exchangeRate
      : 0
    : subtotalPrimary * exchangeRate;

  return (
    <div>
      <div className="relative">
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold ${
            isDocLocal
              ? "text-blue-600 dark:text-blue-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {primarySymbol}
        </span>
        <input
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={displayVal}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-xs font-mono text-right bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 ${
            isDocLocal ? "focus:ring-blue-500" : "focus:ring-emerald-500"
          } transition-all ${
            error ? "border-rose-500" : "border-[var(--color-border)]"
          }`}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
          ≈ {convertedSymbol}{" "}
          {subtotalConverted.toLocaleString(convertedLocale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      {error && (
        <p className="text-[10px] text-rose-500 mt-0.5 font-medium text-right">
          {error.message}
        </p>
      )}
    </div>
  );
}

/**
 * Celda que calcula y muestra en vivo el total del renglón (con IVA) en Moneda del Documento y Contraparte
 */
export function PurchaseItemTotalCell({ control, index }: CellProps) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const item = useWatch({
    control,
    name: `items.${index}`,
  });

  const exchangeRate =
    Number(
      useWatch({
        control,
        name: "exchangeRate",
      }),
    ) || 1.0;

  const documentCurrency =
    useWatch({
      control,
      name: "documentCurrency",
    }) || functionalCurrency;

  const isDocLocal = documentCurrency === localCurrency;
  const primarySymbol = isDocLocal ? localSymbol : functionalSymbol;
  const convertedSymbol = isDocLocal ? functionalSymbol : localSymbol;
  const primaryLocale = isDocLocal ? "es-VE" : "en-US";
  const convertedLocale = isDocLocal ? "en-US" : "es-VE";

  const qty = Number(item?.quantity) || 0;
  const costInput = Number(item?.unitCost) || 0;
  const isTaxable = item?.isTaxable !== false;
  const taxRate = isTaxable
    ? Number(item?.taxRate) > 0
      ? Number(item?.taxRate)
      : 16.0
    : 0;

  const subtotal =
    item?.subtotal !== undefined && item.subtotal > 0
      ? Number(item.subtotal)
      : qty * costInput;
  const tax = (subtotal * taxRate) / 100;
  const totalPrimary = subtotal + tax;

  const totalConverted = isDocLocal
    ? exchangeRate > 0
      ? totalPrimary / exchangeRate
      : 0
    : totalPrimary * exchangeRate;

  return (
    <div className="flex flex-col items-end">
      <span
        className={`font-mono font-bold text-xs ${
          isDocLocal
            ? "text-blue-600 dark:text-blue-400"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {primarySymbol}{" "}
        {totalPrimary.toLocaleString(primaryLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="font-mono font-medium text-[10px] text-[var(--color-text-muted)]">
        {convertedSymbol}{" "}
        {totalConverted.toLocaleString(convertedLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

/**
 * Celda con el indicador de IVA (16% Gravable vs Exento)
 */
export function PurchaseItemTaxCell({
  control,
  index,
  onToggleTaxable,
}: CellProps & {
  onToggleTaxable: (index: number, isTaxable: boolean) => void;
}) {
  const isTaxable = useWatch({
    control,
    name: `items.${index}.isTaxable`,
  });

  const checked = isTaxable !== false;

  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggleTaxable(index, e.target.checked)}
        className="w-4 h-4 rounded border-[var(--color-border)] text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
      />
      <span
        className={`text-[11px] font-semibold whitespace-nowrap ${
          checked
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        {checked ? "IVA 16%" : "Exento"}
      </span>
    </label>
  );
}
