import { Calculator } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../schemas/product.schema';

export interface ProductModalPricingProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  handleCostChange: (cost: number) => void;
  handleMarginChange: (margin: number) => void;
  handleSalePriceChange: (price: number) => void;
}

export function ProductModalPricing({
  register,
  errors,
  handleCostChange,
  handleMarginChange,
  handleSalePriceChange,
}: ProductModalPricingProps) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-[var(--color-sage-600)]" />
          Estructura Financiera y Precios
        </span>
        <span className="text-[11px] text-[var(--color-text-muted)]">
          Cálculo reactivo con Zod Schema
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextInput
          label="Último Costo ($)"
          type="number"
          step="0.01"
          min="0"
          sizeVariant="sm"
          error={errors.lastCost?.message}
          {...register('lastCost', { valueAsNumber: true })}
          onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0)}
        />

        <TextInput
          label="Margen Ganancia (%)"
          type="number"
          step="0.1"
          min="0"
          sizeVariant="sm"
          error={errors.profitMargin?.message}
          {...register('profitMargin', { valueAsNumber: true })}
          onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
        />

        <TextInput
          label="Precio de Venta ($)"
          type="number"
          step="0.01"
          min="0"
          sizeVariant="sm"
          error={errors.lastSalePrice?.message}
          {...register('lastSalePrice', { valueAsNumber: true })}
          onChange={(e) => handleSalePriceChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}

