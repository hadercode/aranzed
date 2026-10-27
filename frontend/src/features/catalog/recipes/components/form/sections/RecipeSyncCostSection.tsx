import { RefreshCw, Info, Sparkles } from 'lucide-react';
import { useRecipeFormContext } from '../../../context';

/**
 * Seccion de Sincronizacion de Costos en la ficha del producto fabricado.
 * Ubicada inmediatamente debajo de los datos basicos del formulario.
 */
export function RecipeSyncCostSection() {
  const { form, costBreakdown, selectedParentProduct } = useRecipeFormContext();
  const { register, watch } = form;

  const isSyncActive = watch('syncProductCost');
  const previousCost = selectedParentProduct ? Number(selectedParentProduct.lastCost) || 0 : 0;
  const newCost = costBreakdown.unitCost;
  const costDiff = newCost - previousCost;

  return (
    <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border mt-0.5 transition-colors ${
              isSyncActive
                ? 'bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 border-[var(--color-sage-500)]/30 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]'
                : 'bg-[var(--color-surface-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isSyncActive ? 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]' : ''}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <label
                htmlFor="syncProductCost"
                className="text-sm font-bold text-[var(--color-text-primary)] cursor-pointer hover:text-[var(--color-sage-600)] transition-colors"
              >
                Sincronización Automática de Costo en Ficha del Producto
              </label>
              {isSyncActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  Activada
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Al guardar la receta, el <strong>Último Costo</strong> del producto fabricado se actualizará automáticamente a{' '}
              <strong className="text-[var(--color-text-primary)] font-mono">${newCost.toFixed(2)}</strong> y se recalculará su precio sugerido de venta.
            </p>
          </div>
        </div>

        {/* Toggle Switch + Indicador de impacto en costo */}
        <div className="flex items-center gap-4 sm:self-center pl-12 sm:pl-0">
          {selectedParentProduct && (
            <div className="text-right hidden md:block">
              <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] tracking-wider block">
                Impacto en Ficha
              </span>
              <div className="text-xs font-mono font-medium text-[var(--color-text-secondary)]">
                ${previousCost.toFixed(2)} → <strong className="text-[var(--color-text-primary)]">${newCost.toFixed(2)}</strong>
                {costDiff !== 0 && (
                  <span
                    className={`ml-1 text-[11px] font-semibold ${
                      costDiff > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    ({costDiff > 0 ? `+${costDiff.toFixed(2)}` : costDiff.toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          )}

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="syncProductCost"
              {...register('syncProductCost')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-surface-bg)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-[var(--color-border)] peer-checked:bg-[var(--color-sage-600)] peer-checked:border-[var(--color-sage-600)]"></div>
          </label>
        </div>
      </div>

      {selectedParentProduct && (
        <div className="mt-3.5 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] shrink-0" />
            <span>
              Producto vinculado: <strong className="text-[var(--color-text-primary)]">{selectedParentProduct.name}</strong> ({selectedParentProduct.uom?.code || 'UND'})
            </span>
          </div>
          <span className="font-mono text-[11px]">
            Costo actual: ${previousCost.toFixed(2)} | Costo resultante BOM: ${newCost.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
