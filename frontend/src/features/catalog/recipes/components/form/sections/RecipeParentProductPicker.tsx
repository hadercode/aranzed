import { Package } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { ParentProductOption } from '../../../hooks/logic/useRecipeFormPage';

export interface RecipeParentProductPickerProps {
  registration: UseFormRegisterReturn;
  parentProductOptions: ParentProductOption[];
  selectedParentProduct?: ParentProductOption | null;
  error?: string;
}

export function RecipeParentProductPicker({
  registration,
  parentProductOptions,
  selectedParentProduct,
  error,
}: RecipeParentProductPickerProps) {
  return (
    <div className="md:col-span-2 space-y-2">
      <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
          Producto Terminado / Fabricado *
        </span>
        {selectedParentProduct && (
          <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">
            Costo actual en ficha:{' '}
            <strong className="text-[var(--color-text-primary)]">
              ${Number(selectedParentProduct.lastCost).toFixed(2)}
            </strong>{' '}
            | UoM:{' '}
            <strong className="text-[var(--color-text-primary)]">
              {selectedParentProduct.uom?.code || 'UND'}
            </strong>
          </span>
        )}
      </label>
      <select
        {...registration}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer ${
          error
            ? 'border-destructive focus:border-destructive'
            : 'border-[var(--color-border)] focus:border-[var(--color-sage-500)]'
        }`}
      >
        <option value="">-- Selecciona el producto a fabricar --</option>
        {parentProductOptions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.type === 'FINISHED_GOOD' ? 'Terminado' : 'Tradicional'} -{' '}
            {p.uom?.code || 'UND'})
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

