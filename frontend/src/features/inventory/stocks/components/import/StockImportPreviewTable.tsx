import { Warehouse, Check } from 'lucide-react';
import type { BulkStockImportItemValidation } from '../../types';
import { StockImportStatusBadge } from './StockImportStatusBadge';

interface StockImportPreviewTableProps {
  rows: BulkStockImportItemValidation[];
}

export function StockImportPreviewTable({ rows }: StockImportPreviewTableProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden max-h-[420px] overflow-y-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="sticky top-0 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] z-10">
          <tr className="text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
            <th className="py-2.5 px-3 w-14">Fila</th>
            <th className="py-2.5 px-3 w-36">Estado</th>
            <th className="py-2.5 px-3 min-w-[200px]">Artículo</th>
            <th className="py-2.5 px-3 w-28">Almacén Destino</th>
            <th className="py-2.5 px-3 w-20 text-right">Cantidad</th>
            <th className="py-2.5 px-3 w-20 text-right">Costo Unit.</th>
            <th className="py-2.5 px-3 w-24 text-right">Costo Total</th>
            <th className="py-2.5 px-3 min-w-[200px]">Validación / Alerta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface-card)]">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-[var(--color-text-muted)]">
                No hay registros que coincidan con la pestaña seleccionada.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.rowNumber}
                className="hover:bg-[var(--color-surface-hover)]/40 transition-colors"
              >
                <td className="py-2.5 px-3 font-mono text-[var(--color-text-muted)]">
                  #{row.rowNumber}
                </td>
                <td className="py-2.5 px-3">
                  <StockImportStatusBadge status={row.status} />
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-[var(--color-text-primary)]">
                    {row.productName}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2">
                    <span>Unidad: {row.uomSymbol}</span>
                    {row.batchNumber && <span>Lote: {row.batchNumber}</span>}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1 text-[var(--color-text-primary)] font-medium">
                    <Warehouse className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <span>{row.warehouseName || '-'}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[var(--color-text-primary)] font-mono">
                  {row.quantity > 0 ? row.quantity.toLocaleString() : '-'}
                </td>
                <td className="py-2.5 px-3 text-right text-[var(--color-text-secondary)] font-mono">
                  ${row.unitCost.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                  ${row.totalCost.toFixed(2)}
                </td>
                <td className="py-2.5 px-3">
                  {row.errors.length > 0 ? (
                    <div className="space-y-1">
                      {row.errors.map((err, i) => (
                        <div
                          key={i}
                          className="text-rose-600 dark:text-rose-400 text-[11px] font-medium leading-tight flex items-start gap-1"
                        >
                          <span className="font-bold shrink-0">•</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  ) : row.warnings && row.warnings.length > 0 ? (
                    <div className="space-y-1">
                      {row.warnings.map((warn, i) => (
                        <div
                          key={i}
                          className="text-amber-600 dark:text-amber-400 text-[11px] leading-tight flex items-start gap-1"
                        >
                          <span className="font-bold shrink-0">•</span>
                          <span>{warn}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Artículo y almacén validados
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

