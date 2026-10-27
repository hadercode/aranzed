import {
  Calculator,
  Boxes,
  Hammer,
  Layers,
} from 'lucide-react';
import { useRecipeFormContext } from '../../../context';

/**
 * Seccion de Desglose de Costos de Fabricacion.
 * Diseñada para ancho completo (full-width) con metricas financieras en 4 columnas.
 */
export function RecipeCostSummarySection() {
  const { form, costBreakdown, selectedParentProduct } = useRecipeFormContext();
  const { watch } = form;

  const yieldQty = Number(watch('yieldQuantity')) || 1;
  const uomCode = selectedParentProduct?.uom?.code || 'UND';

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            Desglose de Costos de Fabricación
          </h2>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">
          Cálculo dinámico basado en los insumos y rendimiento configurados
        </span>
      </div>

      {/* 4-Column Full-Width Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Materia Prima */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/20 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Materia Prima
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
              ${costBreakdown.materialsCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              Insumos y materiales directos
            </p>
          </div>
        </div>

        {/* Card 2: Mano de Obra */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-500/20 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Mano de Obra
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
              ${costBreakdown.laborCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              Servicios y operaciones
            </p>
          </div>
        </div>

        {/* Card 3: Costo Total Lote */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Costo Total Lote (BOM)
            </span>
            <div className="p-1.5 rounded-lg bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
              ${costBreakdown.totalCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              Para {yieldQty} {uomCode}
            </p>
          </div>
        </div>

        {/* Card 4: Costo Unitario Resultante (Destacado) */}
        <div className="p-4 rounded-xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 border-2 border-[var(--color-sage-500)]/30 flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-sage-700)] dark:text-[var(--color-sage-300)] uppercase tracking-wider">
              Costo Unitario
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-sage-600)] text-white">
              Por {uomCode}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-[var(--color-sage-800)] dark:text-[var(--color-sage-200)] tracking-tight">
              ${costBreakdown.unitCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mt-0.5 font-medium">
              Costo directo por unidad producida
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
