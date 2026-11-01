import type { InventoryTransactionItem } from "../../types";

interface TransactionDetailItemsListProps {
  items: InventoryTransactionItem[];
}

export function TransactionDetailItemsList({
  items,
}: TransactionDetailItemsListProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
        Ítems del Movimiento ({items.length})
      </h3>
      <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
            <tr>
              <th className="py-2 px-3">Artículo</th>
              <th className="py-2 px-3 text-right">Cantidad</th>
              <th className="py-2 px-3 text-right">Costo Unit.</th>
              <th className="py-2 px-3 text-right">Subtotal</th>
              <th className="py-2 px-3">Lote / Vence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {items.map((it) => {
              const subtotal = Number(it.quantity) * Number(it.cost || 0);
              return (
                <tr
                  key={it.id}
                  className="hover:bg-[var(--color-surface-hover)]/30"
                >
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-[var(--color-text-primary)] block">
                      {it.nameSnapshot}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                      SKU: {it.skuSnapshot}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {it.quantity} {it.uomSymbol}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[var(--color-text-secondary)]">
                    {it.cost ? `$${Number(it.cost).toFixed(2)}` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                    ${subtotal.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-[var(--color-text-secondary)]">
                    {it.batchNumber ? <div>Lote: {it.batchNumber}</div> : null}
                    {it.expiryDate ? (
                      <div className="text-[var(--color-text-muted)]">
                        Vence: {it.expiryDate.slice(0, 10)}
                      </div>
                    ) : null}
                    {!it.batchNumber && !it.expiryDate && "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
