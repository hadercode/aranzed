import { Modal, Button } from '@/shared/components/ui';
import type { StockLedgerEntry } from '../types';

interface StockLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: StockLedgerEntry[];
  loading?: boolean;
}

export function StockLedgerModal({
  isOpen,
  onClose,
  entries,
  loading = false,
}: StockLedgerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Movimientos de la Capa (Kárdex)"
      size="lg"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
            Cargando historial de movimientos...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
            No hay registros de kárdex para esta existencia.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[60vh] border border-[var(--color-border)] rounded-xl">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Doc / Ref</th>
                  <th className="py-2.5 px-3 text-right">Cant. Movimiento</th>
                  <th className="py-2.5 px-3 text-right">Saldo Físico</th>
                  <th className="py-2.5 px-3 text-right">Saldo Reservado</th>
                  <th className="py-2.5 px-3 text-right">Costo Unit.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {entries.map((e) => {
                  const movement = Number(e.movementQty ?? (e as any).quantity ?? 0);
                  const isPositive = movement > 0;
                  const remaining =
                    e.remainingQty !== undefined && e.remainingQty !== null
                      ? Number(e.remainingQty).toFixed(2)
                      : e.stock?.physicalQty !== undefined
                        ? Number(e.stock.physicalQty).toFixed(2)
                        : '-';
                  const reserved =
                    e.remainingReservedQty !== undefined && e.remainingReservedQty !== null
                      ? Number(e.remainingReservedQty).toFixed(2)
                      : e.stock?.reservedQty !== undefined
                        ? Number(e.stock.reservedQty).toFixed(2)
                        : '0.00';

                  return (
                    <tr key={e.id} className="hover:bg-[var(--color-surface-hover)]">
                      <td className="py-2 px-3 font-mono">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-medium text-[var(--color-text-primary)]">
                        {e.transactionItem?.transaction?.transactionNumber || 'Movimiento'}
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-semibold ${
                          movement < 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isPositive ? `+${movement.toFixed(2)}` : movement.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{remaining}</td>
                      <td className="py-2 px-3 text-right font-mono text-amber-600">
                        {reserved}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        ${Number(e.unitCost || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
