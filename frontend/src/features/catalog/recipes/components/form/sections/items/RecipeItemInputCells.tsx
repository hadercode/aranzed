import React from 'react';
import { Trash2 } from 'lucide-react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import type { ComponentProductOption } from '../../../../hooks/logic/useRecipeFormPage';

export interface RecipeItemSelectCellProps {
  registration: UseFormRegisterReturn;
  onChange: (val: string) => void;
  options: ComponentProductOption[];
  error?: FieldError;
}

export function RecipeItemSelectCell({
  registration,
  onChange,
  options,
  error,
}: RecipeItemSelectCellProps) {
  return (
    <div>
      <select
        {...registration}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all cursor-pointer ${
          error ? 'border-destructive' : 'border-[var(--color-border)]'
        }`}
      >
        <option value="">-- Selecciona insumo/servicio --</option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (
            {p.type === 'RAW_MATERIAL'
              ? 'Mat. Prima'
              : p.type === 'SERVICE'
              ? 'Mano de Obra'
              : 'Producto'}{' '}
            - {p.uom?.code || 'UND'})
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-destructive mt-0.5 font-medium">{error.message}</p>}
    </div>
  );
}

export interface RecipeItemQuantityInputProps {
  registration: UseFormRegisterReturn;
  error?: FieldError;
  badge: React.ReactNode;
}

export function RecipeItemQuantityInput({
  registration,
  error,
  badge,
}: RecipeItemQuantityInputProps) {
  return (
    <div>
      <div className="relative">
        <input
          type="number"
          step="any"
          min="0.0001"
          placeholder="1.0"
          {...registration}
          className={`w-full px-2 py-1.5 pr-8 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all ${
            error ? 'border-destructive' : 'border-[var(--color-border)]'
          }`}
        />
        {badge}
      </div>
      {error && <p className="text-[10px] text-destructive mt-0.5 font-medium">{error.message}</p>}
    </div>
  );
}

export interface RecipeItemCostInputProps {
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export function RecipeItemCostInput({ registration, error }: RecipeItemCostInputProps) {
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
          {...registration}
          className={`w-full pl-5 pr-2 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all ${
            error ? 'border-destructive' : 'border-[var(--color-border)]'
          }`}
        />
      </div>
      {error && <p className="text-[10px] text-destructive mt-0.5 font-medium">{error.message}</p>}
    </div>
  );
}

export function RecipeItemActionCell({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      title="Eliminar fila"
      className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
