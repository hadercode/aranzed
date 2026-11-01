import { Calculator, DollarSign, Percent } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { TextInput } from "@/shared/components/ui/form";
import type { ProductFormData } from "../../../schemas/product.schema";

export interface ProductPricingSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  costValue: number;
  salePriceValue: number;
  grossProfit: number;
  profitMarginPercent: string;
  marginOnRevenuePercent: string;
  handleCostChange: (cost: number) => void;
  handleMarginChange: (margin: number) => void;
  handleSalePriceChange: (salePrice: number) => void;
}

export function ProductPricingSection({
  register,
  errors,
  handleCostChange,
  handleMarginChange,
  handleSalePriceChange,
  grossProfit,
  profitMarginPercent,
  marginOnRevenuePercent,
}: ProductPricingSectionProps) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
        <div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[var(--color-sage-600)]" />
            4. Estructura Financiera y Precios de Venta
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Cálculo reactivo en tiempo real con validación matemática.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-sage-50)] text-[var(--color-sage-700)] dark:bg-[var(--color-sage-500)]/15 dark:text-[var(--color-sage-300)]">
          <span>Precio = Costo × (1 + Margen%)</span>
        </div>
      </div>

      {/* Financial Inputs Grid using global TextInput */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cost */}
        <TextInput
          label="Último Costo ($)"
          type="number"
          step="0.01"
          min="0"
          leftIcon={
            <DollarSign className="w-4 h-4 text-[var(--color-text-muted)]" />
          }
          error={errors.lastCost?.message}
          helperText="Costo de adquisición o fabricación."
          {...register("lastCost", { valueAsNumber: true })}
          onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0)}
        />

        {/* Profit Margin */}
        <TextInput
          label="Margen de Ganancia (%)"
          type="number"
          step="0.1"
          min="0"
          leftIcon={
            <Percent className="w-4 h-4 text-[var(--color-text-muted)]" />
          }
          error={errors.profitMargin?.message}
          helperText="Sobre el costo directo."
          {...register("profitMargin", { valueAsNumber: true })}
          onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
        />

        {/* Suggested / Final Sale Price */}
        <TextInput
          label="Precio de Venta ($)"
          type="number"
          step="0.01"
          min="0"
          leftIcon={
            <DollarSign className="w-4 h-4 text-[var(--color-sage-600)]" />
          }
          error={errors.lastSalePrice?.message}
          helperText="Base imponible antes de impuestos."
          {...register("lastSalePrice", { valueAsNumber: true })}
          onChange={(e) =>
            handleSalePriceChange(parseFloat(e.target.value) || 0)
          }
        />
      </div>

      {/* Dynamic Financial KPI Preview */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-[var(--color-text-muted)] block">
            Ganancia Bruta por Unidad
          </span>
          <span className="text-base font-bold text-[var(--color-text-primary)] mt-0.5 block">
            ${grossProfit.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-xs text-[var(--color-text-muted)] block">
            Margen sobre Costo Real
          </span>
          <span className="text-base font-bold text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mt-0.5 block">
            {profitMarginPercent}%
          </span>
        </div>

        <div>
          <span className="text-xs text-[var(--color-text-muted)] block">
            Margen sobre Ingreso (Markup)
          </span>
          <span className="text-base font-bold text-[var(--color-text-primary)] mt-0.5 block">
            {marginOnRevenuePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductPricingSection;
