import { useState } from 'react';
import { History, Search } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui';
import { useQuery } from '@tanstack/react-query';
import { stocksService } from '../services';

export function LedgerPage() {
  const [search, setSearch] = useState('');

  const { data: ledgerEntries = [], isLoading } = useQuery({
    queryKey: ['inventory', 'ledger'],
    queryFn: () => stocksService.getLedger(),
    staleTime: 1000 * 60,
  });

  const filteredEntries = ledgerEntries.filter((l) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const sku = l.transactionItem?.skuSnapshot?.toLowerCase() || '';
    const name = l.transactionItem?.nameSnapshot?.toLowerCase() || '';
    const txNum = l.transactionItem?.transaction?.transactionNumber?.toLowerCase() || '';
    return sku.includes(term) || name.includes(term) || txNum.includes(term);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Libro Mayor de Inventario (Kárdex)"
        description="Auditoría inmutable de entradas y salidas valorizadas por cada lote y capa de existencias."
        icon={<History className="w-6 h-6 text-[var(--color-sage-600)]" />}
      />

      {/* Buscador */}
      <div className="bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por SKU, producto o nº de transacción..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>
      </div>

      {/* Tabla Kárdex */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
              <tr>
                <th className="py-3.5 px-4">Fecha / Registro</th>
                <th className="py-3.5 px-4">Nº Transacción</th>
                <th className="py-3.5 px-4">Tipo Movimiento</th>
                <th className="py-3.5 px-4">Producto / SKU</th>
                <th className="py-3.5 px-4">Almacén</th>
                <th className="py-3.5 px-4 text-right">Cantidad Afectada</th>
                <th className="py-3.5 px-4 text-right">Costo Unit.</th>
                <th className="py-3.5 px-4 text-right">Impacto Monetario ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--color-text-muted)]">
                    Cargando Kárdex...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--color-text-muted)]">
                    No hay registros de kárdex disponibles.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((l) => {
                  const qty = Number(l.movementQty ?? (l as any).quantity ?? 0);
                  const isIngress = qty > 0;
                  return (
                    <tr key={l.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="py-3 px-4 text-xs text-[var(--color-text-secondary)]">
                        {l.createdAt.slice(0, 16).replace('T', ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[var(--color-sage-600)]">
                        {l.transactionItem?.transaction?.transactionNumber || '-'}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {l.transactionItem?.transaction?.type || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {l.transactionItem?.nameSnapshot}
                        </div>
                        <div className="text-xs font-mono text-[var(--color-text-muted)]">
                          SKU: {l.transactionItem?.skuSnapshot}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[var(--color-text-secondary)]">
                        {l.stock?.warehouse?.name || '-'}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          isIngress ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIngress ? `+${qty.toFixed(2)}` : qty.toFixed(2)}{' '}
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {l.transactionItem?.uomSymbol}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">
                        ${Number(l.unitCost).toFixed(4)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-semibold ${
                          isIngress ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        ${Number(l.totalCost).toFixed(2)}
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
