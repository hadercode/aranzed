import type { BulkImportItemValidation } from '../../../types';
import { statusBadgeStyles } from './ProductImportStatusBadge';

const productTypeLabels: Record<string, string> = {
  TRADITIONAL: 'Tradicional',
  RAW_MATERIAL: 'Materia Prima',
  FINISHED_GOOD: 'Prod. Terminado',
  SERVICE: 'Servicio',
};

export function ProductImportPreviewTable({ rows }: { rows: BulkImportItemValidation[] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden max-h-[420px] overflow-y-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="sticky top-0 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] z-10">
          <tr className="text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
            <th className="py-2.5 px-3 w-14">Fila</th>
            <th className="py-2.5 px-3 w-36">Estado</th>
            <th className="py-2.5 px-3 min-w-[180px]">Artículo</th>
            <th className="py-2.5 px-3 w-28">Tipo</th>
            <th className="py-2.5 px-3 w-20">UoM</th>
            <th className="py-2.5 px-3 w-28">Categoría</th>
            <th className="py-2.5 px-3 w-20 text-right">Costo</th>
            <th className="py-2.5 px-3 w-24 text-right">Precio</th>
            <th className="py-2.5 px-3 min-w-[200px]">Detalle de Validación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface-card)]">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-[var(--color-text-muted)]">
                No hay registros que coincidan con la pestaña seleccionada.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const badge = statusBadgeStyles[row.status];
              const IconComponent = badge.icon;

              return (
                <tr key={row.rowNumber} className="hover:bg-[var(--color-surface-hover)]/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[var(--color-text-muted)]">#{row.rowNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold ${badge.bg}`}>
                      <IconComponent className="w-3.5 h-3.5 shrink-0" />
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[var(--color-text-primary)]">{row.name}</div>
                    {row.description && (
                      <div className="text-[11px] text-[var(--color-text-muted)] truncate max-w-xs">
                        {row.description}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">
                    {productTypeLabels[row.type] || row.type}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[var(--color-text-primary)]">
                    {row.uomNameOrCode}
                  </td>
                  <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">
                    {row.categoryName || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[var(--color-text-secondary)] font-mono">
                    ${row.lastCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[var(--color-text-primary)] font-mono">
                    ${row.lastSalePrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3">
                    {row.errors.length > 0 ? (
                      <div className="space-y-1">
                        {row.errors.map((err, i) => (
                          <div key={i} className="text-rose-600 dark:text-rose-400 text-[11px] font-medium leading-tight flex items-start gap-1">
                            <span className="font-bold shrink-0">•</span>
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    ) : row.warnings && row.warnings.length > 0 ? (
                      <div className="space-y-1">
                        {row.warnings.map((warn, i) => (
                          <div key={i} className="text-amber-600 dark:text-amber-400 text-[11px] leading-tight flex items-start gap-1">
                            <span className="font-bold shrink-0">•</span>
                            <span>{warn}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                        Listo para registrar
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

