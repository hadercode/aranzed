import { useWatch, type Control } from 'react-hook-form';
import type { PurchaseFormData } from '../../../../schemas/purchase.schema';

export function PurchaseItemTaxCell({
  control,
  index,
  onToggleTaxable,
}: {
  control: Control<PurchaseFormData>;
  index: number;
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
          checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text-muted)]'
        }`}
      >
        {checked ? 'IVA 16%' : 'Exento'}
      </span>
    </label>
  );
}

