import { Trash2 } from 'lucide-react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import type { Product } from '@/features/catalog/products/types';

export function PurchaseItemMaterialSelectCell({
  registration,
  onChange,
  rawMaterials,
  functionalSymbol,
  error,
}: {
  registration: UseFormRegisterReturn;
  onChange: (val: string) => void;
  rawMaterials: Product[];
  functionalSymbol: string;
  error?: FieldError;
}) {
  return (
    <div>
      <select
        {...registration}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer ${
          error ? 'border-rose-500' : 'border-[var(--color-border)]'
        }`}
      >
        <option value="">-- Seleccionar Material --</option>
        {rawMaterials.map((mat) => (
          <option key={mat.id} value={mat.id}>
            {mat.name} {mat.uom ? `(${mat.uom.code})` : ''} - Últ. Costo: {functionalSymbol}
            {Number(mat.lastCost).toFixed(2)}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-rose-500 mt-0.5 font-medium">{error.message}</p>}
    </div>
  );
}

export function PurchaseItemDescriptionCell({
  registration,
  error,
}: {
  registration: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Descripción del ítem..."
        {...registration}
        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
          error ? 'border-rose-500' : 'border-[var(--color-border)]'
        }`}
      />
      {error && <p className="text-[10px] text-rose-500 mt-0.5 font-medium">{error.message}</p>}
    </div>
  );
}

export function PurchaseItemQuantityCell({
  registration,
  error,
}: {
  registration: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div>
      <input
        type="number"
        step="any"
        min="0.0001"
        placeholder="1.0"
        {...registration}
        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono text-right bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
          error ? 'border-rose-500' : 'border-[var(--color-border)]'
        }`}
      />
      {error && <p className="text-[10px] text-rose-500 mt-0.5 font-medium text-right">{error.message}</p>}
    </div>
  );
}

export function PurchaseItemRemoveCell({
  onRemove,
  canRemove,
}: {
  onRemove: () => void;
  canRemove: boolean;
}) {
  if (!canRemove) return null;
  return (
    <button
      type="button"
      onClick={onRemove}
      title="Eliminar este material"
      className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

