import { useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { PageHeader, StatCard } from '@/shared/components/ui';
import { useAdjustmentsReportQuery } from '../hooks';

export function AdjustmentsReportPage() {
  const [search, setSearch] = useState('');
  const { adjustmentsReport = [], isLoading } = useAdjustmentsReportQuery();

  const filtered = adjustmentsReport.filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const reason = r.reasonName?.toLowerCase() || '';
    const wh = r.warehouseName?.toLowerCase() || '';
    const tx = r.transactionNumber?.toLowerCase() || '';
    return reason.includes(term) || wh.includes(term) || tx.includes(term);
  });

  const totalCostImpact = filtered.reduce(
    (acc, r) => acc + Math.abs(Number(r.totalCostImpactUsd || 0)),
    0,
  );
  const totalQuantity = filtered.reduce(
    (acc, r) => acc + Math.abs(Number(r.totalDiffQty || 0)),
    0,
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Reporte Analítico de Mermas y Ajustes"
        description="Consolidación valorizada de pérdidas operativas, deterioros y diferencias de auditoría física."
        icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Impacto Monetario Total"
          value={`$${totalCostImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Costo de mercancía afectada"
          color="rose"
        />
        <StatCard
          title="Unidades Totales Ajustadas"
          value={totalQuantity.toFixed(2)}
          description="Cantidades físicas auditadas"
          color="amber"
        />
        <StatCard
          title="Eventos de Ajuste"
          value={filtered.length.toString()}
          description="Transacciones consolidadas"
          color="blue"
        />
      </div>

      {/* Buscador */}
      <div className="bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por motivo, almacén o nº transacción..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>
      </div>

      {/* Tabla de Mermas y Ajustes */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
              <tr>
                <th className="py-3.5 px-4">Fecha Movimiento</th>
                <th className="py-3.5 px-4">Nº Transacción</th>
                <th className="py-3.5 px-4">Motivo / Causa</th>
                <th className="py-3.5 px-4">Almacén</th>
                <th className="py-3.5 px-4 text-center">Ítems Afectados</th>
                <th className="py-3.5 px-4 text-right">Diferencia Unidades</th>
                <th className="py-3.5 px-4 text-right">Impacto Total ($)</th>
                <th className="py-3.5 px-4 text-right">Impacto Total (Bs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--color-text-muted)]">
                    Cargando reporte de mermas...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--color-text-muted)]">
                    No se registran mermas o ajustes bajo los filtros actuales.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const isNegative = Number(r.totalDiffQty) < 0;
                  return (
                    <tr
                      key={r.transactionId}
                      className="hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <td className="py-3 px-4 text-xs text-[var(--color-text-secondary)]">
                        {r.movementDate?.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[var(--color-sage-600)]">
                        {r.transactionNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--color-text-primary)]">
                        {r.reasonName}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {r.warehouseName}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {r.totalItems}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          isNegative
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {Number(r.totalDiffQty).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                        ${Math.abs(Number(r.totalCostImpactUsd || 0)).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[var(--color-text-secondary)]">
                        Bs. {Math.abs(Number(r.totalCostImpactLocal || 0)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
