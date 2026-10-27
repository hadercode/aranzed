import { History } from 'lucide-react';
import type { InventoryStock } from '../types';

interface StockTableProps {
  stocks: InventoryStock[];
  isLoading: boolean;
  onOpenLedger: (stockId: string) => void;
}

export function StockTable({ stocks, isLoading, onOpenLedger }: StockTableProps) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
            <tr>
              <th className="py-3.5 px-4">Producto / SKU</th>
              <th className="py-3.5 px-4">Almacén</th>
              <th className="py-3.5 px-4">Lote / Ingreso</th>
              <th className="py-3.5 px-4 text-right">Físico</th>
              <th className="py-3.5 px-4 text-right">Reservado</th>
              <th className="py-3.5 px-4 text-right font-semibold">Disponible</th>
              <th className="py-3.5 px-4 text-right">Costo Unit.</th>
              <th className="py-3.5 px-4 text-right">Valor Total ($)</th>
              <th className="py-3.5 px-4 text-center">Kárdex</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                  Cargando existencias...
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                  No se encontraron registros de stock con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              stocks.map((s) => {
                const totalValue = Number(s.physicalQty) * Number(s.unitCost);
                return (
                  <tr key={s.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {s.productNameSnapshot}
                      </div>
                      <div className="text-xs font-mono text-[var(--color-text-secondary)]">
                        {s.skuSnapshot}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                      {s.warehouse?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-[var(--color-text-primary)]">
                        {s.batchNumber || 'SIN-LOTE'}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {new Date(s.entryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-[var(--color-text-primary)]">
                      {Number(s.physicalQty).toFixed(2)} {s.uomSymbol}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400 font-medium">
                      {Number(s.reservedQty) > 0 ? `${Number(s.reservedQty).toFixed(2)} ${s.uomSymbol}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {Number(s.availableQty).toFixed(2)} {s.uomSymbol}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[var(--color-text-secondary)]">
                      ${Number(s.unitCost).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--color-text-primary)]">
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenLedger(s.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--color-sage-600)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                        title="Ver movimientos detallados"
                      >
                        <History className="w-3.5 h-3.5" /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
