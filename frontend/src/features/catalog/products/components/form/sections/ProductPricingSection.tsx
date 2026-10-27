import { Calculator, DollarSign, Percent, Sparkles } from 'lucide-react';
import { useProductFormContext } from '../../../context';

export function ProductPricingSection() {
  const {
    register,
    errors,
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
    costValue,
    salePriceValue,
    grossProfit,
    profitMarginPercent,
    marginOnRevenuePercent,
  } = useProductFormContext();

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

      {/* Financial Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cost */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-1.5">
          <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Último Costo ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('lastCost', { valueAsNumber: true })}
              onChange={(e) =>
                handleCostChange(parseFloat(e.target.value) || 0)
              }
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-base font-mono font-bold border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all"
            />
          </div>
          {errors.lastCost && (
            <p className="text-xs text-rose-500 font-medium">{errors.lastCost.message}</p>
          )}
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Costo de adquisición o fabricación.
          </span>
        </div>

        {/* Profit Margin */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-1.5">
          <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Margen de Ganancia (%)
          </label>
          <div className="relative">
            <Percent className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.1"
              min="0"
              {...register('profitMargin', { valueAsNumber: true })}
              onChange={(e) =>
                handleMarginChange(parseFloat(e.target.value) || 0)
              }
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-base font-mono font-bold border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all"
            />
          </div>
          {errors.profitMargin && (
            <p className="text-xs text-rose-500 font-medium">{errors.profitMargin.message}</p>
          )}
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Porcentaje sobre el costo base.
          </span>
        </div>

        {/* Sale Price */}
        <div className="p-4 rounded-2xl bg-[var(--color-sage-50)]/50 dark:bg-[var(--color-sage-500)]/10 border border-[var(--color-sage-300)] dark:border-[var(--color-sage-500)]/30 space-y-1.5">
          <label className="block text-xs font-bold text-[var(--color-sage-800)] dark:text-[var(--color-sage-300)] uppercase tracking-wider">
            Precio de Venta Sugerido ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[var(--color-sage-600)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('lastSalePrice', { valueAsNumber: true })}
              onChange={(e) =>
                handleSalePriceChange(parseFloat(e.target.value) || 0)
              }
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-base font-mono font-black border border-[var(--color-sage-400)]/80 bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/40 transition-all"
            />
          </div>
          {errors.lastSalePrice && (
            <p className="text-xs text-rose-500 font-medium">{errors.lastSalePrice.message}</p>
          )}
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Precio final al cliente (editable).
          </span>
        </div>
      </div>

      {/* Reactive Profit Simulation Cards */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-surface-card)] text-[var(--color-sage-600)] border border-[var(--color-border)] shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--color-text-primary)] block">
              Análisis de Utilidad Unitaria
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Costo: ${costValue.toFixed(2)} → Venta: ${salePriceValue.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
              Ganancia Bruta
            </span>
            <span className="text-base font-black font-mono text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
              +${grossProfit.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
              Margen / Costo
            </span>
            <span className="text-sm font-bold font-mono text-[var(--color-text-primary)]">
              {profitMarginPercent}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
              Margen / Venta
            </span>
            <span className="text-sm font-bold font-mono text-[var(--color-text-primary)]">
              {marginOnRevenuePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPricingSection;
