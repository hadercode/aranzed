import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import {
  DollarSign,
  AlertCircle,
  Eye,
  FileText,
  CheckCircle2,
  Ban,
  Clock,
} from "lucide-react";
import type { Sale } from "../../../types";
import { ReceiptViewerModal } from "./ReceiptViewerModal";
import { useSalePaymentsHistory } from "../../../hooks/logic/useSalePaymentsHistory";

export interface SalePaymentsHistoryModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickPayment?: (sale: Sale) => void;
}

export function SalePaymentsHistoryModal({
  sale,
  isOpen,
  onClose,
  onOpenQuickPayment,
}: SalePaymentsHistoryModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <SalePaymentsHistoryContent
      key={sale.id}
      sale={sale}
      isOpen={isOpen}
      onClose={onClose}
      onOpenQuickPayment={onOpenQuickPayment}
    />
  );
}

function SalePaymentsHistoryContent({
  sale,
  isOpen,
  onClose,
  onOpenQuickPayment,
}: {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickPayment?: (sale: Sale) => void;
}) {
  const history = useSalePaymentsHistory(sale.id);

  const pendingUsd = Math.max(
    0,
    Number((sale.total - (sale.paidAmount || 0)).toFixed(2)),
  );
  const pendingVes = Math.max(
    0,
    Number((sale.totalLocal - (sale.paidAmountLocal || 0)).toFixed(2)),
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Historial de Cobros y Abonos"
        size="lg"
      >
        <div className="flex items-center gap-2 mb-4 -mt-2">
          <div className="p-1.5 rounded-lg bg-sage-500/10 text-sage-600 dark:text-sage-400">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Venta {sale.saleNumber} &bull; {sale.customerName}
          </p>
        </div>

        <div className="space-y-4">
          {/* Tarjeta de Resumen Financiero */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
            <div>
              <span className="text-[var(--color-text-muted)] block">
                Total Facturado:
              </span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                ${sale.total.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block">
                Monto Recaudado:
              </span>
              <span className="text-sm font-bold text-emerald-600">
                ${(sale.paidAmount || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block">
                Saldo Pendiente:
              </span>
              <span
                className={`text-sm font-bold ${
                  pendingUsd > 0.01 ? "text-amber-600" : "text-emerald-600"
                }`}
              >
                ${pendingUsd.toFixed(2)}{" "}
                <span className="text-xs font-normal text-[var(--color-text-muted)]">
                  (Bs. {pendingVes.toFixed(2)})
                </span>
              </span>
            </div>
          </div>

          {/* Listado de Cobros */}
          {history.isLoading ? (
            <div className="py-12 text-center text-xs text-[var(--color-text-muted)]">
              Cargando historial de pagos...
            </div>
          ) : history.error ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{history.error}</span>
            </div>
          ) : history.payments.length === 0 ? (
            <div className="py-8 text-center space-y-2 border border-dashed border-[var(--color-border)] rounded-xl">
              <DollarSign className="w-8 h-8 text-[var(--color-text-muted)] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                No hay cobros aplicados a esta venta todavía
              </p>
              <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
                Puedes registrar un cobro directo usando el botón de abajo o
                cruzando un pago desde el formulario de cobros.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                    <th className="py-2.5 px-3 font-semibold">Nº Cobro</th>
                    <th className="py-2.5 px-3 font-semibold">Fecha</th>
                    <th className="py-2.5 px-3 font-semibold">Método / Ref</th>
                    <th className="py-2.5 px-3 font-semibold text-right">
                      Imputado ($)
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-center">
                      Comprobante
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-center">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {history.payments.map((p) => {
                    const thisAlloc = p.allocations?.find(
                      (a) => a.saleId === sale.id,
                    );
                    const allocatedAmount = thisAlloc
                      ? thisAlloc.amountAllocated
                      : p.amount;
                    const isConfirmed = p.status === "CONFIRMED";

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-xs text-[var(--color-text-primary)]">
                          {p.paymentNumber}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--color-text-secondary)] whitespace-nowrap">
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {p.paymentMethod}
                          </p>
                          {p.reference && (
                            <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                              Ref: {p.reference}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-bold text-emerald-600">
                            ${Number(allocatedAmount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {p.receiptUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                history.handleOpenReceipt(p.receiptUrl!)
                              }
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                            >
                              {p.receiptUrl.toLowerCase().endsWith(".pdf") ? (
                                <FileText className="w-3 h-3 text-rose-500" />
                              ) : (
                                <Eye className="w-3 h-3 text-blue-500" />
                              )}
                              <span>Ver</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-[var(--color-text-muted)] italic">
                              -
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                              isConfirmed
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 line-through"
                            }`}
                          >
                            {isConfirmed ? (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            ) : (
                              <Ban className="w-2.5 h-2.5" />
                            )}
                            {isConfirmed ? "APLICADO" : "ANULADO"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
            {pendingUsd > 0.01 && onOpenQuickPayment ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenQuickPayment(sale);
                }}
                leftIcon={<DollarSign className="w-4 h-4" />}
              >
                Registrar Abono a esta Venta
              </Button>
            ) : (
              <div />
            )}
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Visor de comprobante anidado */}
      <ReceiptViewerModal
        isOpen={Boolean(history.viewerReceiptUrl)}
        receiptUrl={history.viewerReceiptUrl}
        title="Comprobante de Pago"
        onClose={history.handleCloseReceipt}
      />
    </>
  );
}
