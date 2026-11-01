import { Trash2 } from 'lucide-react';

interface SaleItemTotalsCellProps {
  index: number;
  isTaxable: boolean;
  lineTotalUSD: number;
  lineTotalLocal: number;
  onToggleTaxable: (index: number, taxable: boolean) => void;
  onRemove: (index: number) => void;
}

export function SaleItemTotalsCell({
  index,
  isTaxable,
  lineTotalUSD,
  lineTotalLocal,
  onToggleTaxable,
  onRemove,
}: SaleItemTotalsCellProps) {
  return (
    <>
      <td className="py-2.5 px-2 w-24 text-center align-top pt-2">
        <button
          type="button"
          onClick={() => onToggleTaxable(index, !isTaxable)}
          className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            isTaxable
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
          }`}
          title={isTaxable ? 'Gravable IVA 16%' : 'Exento de IVA'}
        >
          <span>{isTaxable ? '16%' : 'Exento'}</span>
        </button>
      </td>

      <td className="py-2.5 px-3 text-right whitespace-nowrap min-w-[120px] align-top pt-2">
        <div className="font-bold text-sm text-[var(--color-text-primary)]">
          ${lineTotalUSD.toFixed(2)}
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
          Bs. {lineTotalLocal.toFixed(2)}
        </div>
      </td>

      <td className="py-2.5 px-2 text-center w-12 align-top pt-2">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Eliminar este producto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </>
  );
}

