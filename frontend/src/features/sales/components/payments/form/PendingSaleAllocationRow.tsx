import type { PendingSaleForPayment } from '../../../types';

export interface PendingSaleAllocationRowProps {
  sale: PendingSaleForPayment;
  alloc: { amount: number; closeWithDiff: boolean };
  onAllocationChange: (saleId: string, val: number) => void;
  onToggleCloseDiff: (saleId: string, checked: boolean) => void;
  onFillMaxForSale: (sale: { id: string; balance: number }) => void;
}

export function PendingSaleAllocationRow({
  sale,
  alloc,
  onAllocationChange,
  onToggleCloseDiff,
  onFillMaxForSale,
}: PendingSaleAllocationRowProps) {
  const assigned = alloc.amount || 0;
  const newBalance = Math.max(0, Number((sale.balance - assigned).toFixed(2)));
  const isCleared = newBalance <= 0.01 && assigned > 0;

  return (
    <tr className={`hover:bg-[var(--color-surface-hover)] transition-colors ${assigned > 0 ? 'bg-sage-500/5' : ''}`}>
      <td className="py-3 px-3">
        <p className="font-mono font-bold text-xs text-[var(--color-text-primary)]">{sale.saleNumber}</p>
        <p className="text-[11px] text-[var(--color-text-muted)]">{sale.customerName}</p>
      </td>

      <td className="py-3 px-3 text-[var(--color-text-secondary)] whitespace-nowrap">
        {new Date(sale.saleDate).toLocaleDateString()}
      </td>

      <td className="py-3 px-3 text-right font-medium text-[var(--color-text-secondary)]">
        ${sale.total.toFixed(2)}
      </td>

      <td className="py-3 px-3 text-right text-[var(--color-text-muted)]">
        ${sale.paidAmount.toFixed(2)}
      </td>

      <td className="py-3 px-3 text-right">
        <p className="font-bold text-[var(--color-text-primary)]">${sale.balance.toFixed(2)}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">Bs. {sale.balanceLocal.toFixed(2)}</p>
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5 justify-center">
          <div className="relative w-28">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
              $
            </span>
            <input
              type="number"
              step="any"
              min="0"
              max={sale.balance}
              value={assigned === 0 ? '' : assigned}
              onChange={(e) => onAllocationChange(sale.id, Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0.00"
              className={`w-full pl-6 pr-2 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-surface-bg)] border text-[var(--color-text-primary)] focus:outline-none ${
                assigned > 0 ? 'border-emerald-500 text-emerald-600' : 'border-[var(--color-border)]'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => onFillMaxForSale(sale)}
            className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-[var(--color-surface-bg)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-sage-600 whitespace-nowrap"
            title="Cubrir saldo pendiente con el monto restante"
          >
            Cubrir
          </button>
        </div>
        {isCleared && <p className="text-[10px] text-emerald-600 text-center font-semibold mt-1">✓ Queda saldada</p>}
      </td>

      <td className="py-3 px-3 text-center">
        <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={alloc.closeWithDiff}
            onChange={(e) => onToggleCloseDiff(sale.id, e.target.checked)}
            className="w-3.5 h-3.5 rounded text-sage-600 focus:ring-sage-500 border-[var(--color-border)]"
          />
          <span className="text-[10px] text-[var(--color-text-muted)]">≤ $0.05</span>
        </label>
      </td>
    </tr>
  );
}

