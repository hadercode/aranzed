import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import type { Sale } from '../../../types';

export interface SaleStateConfirmDialogsProps {
  confirmSaleTarget: Sale | null;
  setConfirmSaleTarget: (sale: Sale | null) => void;
  handleConfirmSale: () => void;
  isChangingStatus: boolean;
  convertQuotationTarget: Sale | null;
  setConvertQuotationTarget: (sale: Sale | null) => void;
  handleConvertQuotation: () => void;
  isConverting: boolean;
  cancelSaleTarget: Sale | null;
  setCancelSaleTarget: (sale: Sale | null) => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  handleCancelSale: () => void;
  deleteSaleTarget: Sale | null;
  setDeleteSaleTarget: (sale: Sale | null) => void;
  handleDeleteSale: () => void;
  isDeleting: boolean;
}

export function SaleStateConfirmDialogs({
  confirmSaleTarget,
  setConfirmSaleTarget,
  handleConfirmSale,
  isChangingStatus,
  convertQuotationTarget,
  setConvertQuotationTarget,
  handleConvertQuotation,
  isConverting,
  cancelSaleTarget,
  setCancelSaleTarget,
  cancelReason,
  setCancelReason,
  handleCancelSale,
  deleteSaleTarget,
  setDeleteSaleTarget,
  handleDeleteSale,
  isDeleting,
}: SaleStateConfirmDialogsProps) {
  return (
    <>
      <ConfirmDialog
        isOpen={Boolean(confirmSaleTarget)}
        title="Confirmar y Completar Venta"
        message={
          <div className="space-y-2 text-sm">
            <p>
              ¿Deseas marcar la venta{' '}
              <strong className="text-[var(--color-text-primary)]">#{confirmSaleTarget?.saleNumber}</strong> para el
              cliente <strong className="text-[var(--color-text-primary)]">"{confirmSaleTarget?.customerName}"</strong>{' '}
              como <span className="text-emerald-600 font-bold">COMPLETADA</span>?
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              Al confirmar, el sistema emitirá el evento desacoplado <code>SaleCompletedEvent</code> para que el módulo de
              Inventario descuente el stock.
            </p>
          </div>
        }
        confirmText="Confirmar Venta"
        cancelText="Volver"
        variant="info"
        loading={isChangingStatus}
        onConfirm={handleConfirmSale}
        onClose={() => setConfirmSaleTarget(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(convertQuotationTarget)}
        title="Convertir Cotización en Venta Directa"
        message={
          <div className="space-y-2 text-sm">
            <p>
              ¿Deseas transformar la cotización{' '}
              <strong className="text-[var(--color-text-primary)]">#{convertQuotationTarget?.saleNumber}</strong> en una
              venta comercial definitiva?
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Se generará un nuevo correlativo de venta directa manteniendo el enlace histórico con la cotización.
            </p>
          </div>
        }
        confirmText="Convertir a Venta"
        cancelText="Cancelar"
        variant="info"
        loading={isConverting}
        onConfirm={handleConvertQuotation}
        onClose={() => setConvertQuotationTarget(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(cancelSaleTarget)}
        title="Anular Documento de Venta"
        message={
          <div className="space-y-3 text-sm">
            <p>
              ¿Estás seguro de anular la venta / cotización{' '}
              <strong className="text-rose-600">#{cancelSaleTarget?.saleNumber}</strong>? Esta acción es irreversible.
            </p>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Motivo de la anulación (opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. Desistimiento del cliente, error en precio..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        }
        confirmText="Sí, Anular Documento"
        cancelText="Cancelar"
        variant="danger"
        loading={isChangingStatus}
        onConfirm={handleCancelSale}
        onClose={() => {
          setCancelSaleTarget(null);
          setCancelReason('');
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteSaleTarget)}
        title="Eliminar Registro de Venta"
        message={`¿Deseas eliminar permanentemente el borrador #${deleteSaleTarget?.saleNumber}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteSale}
        onClose={() => setDeleteSaleTarget(null)}
      />
    </>
  );
}

