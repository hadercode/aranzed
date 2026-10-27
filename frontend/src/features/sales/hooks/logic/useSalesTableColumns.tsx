import { useMemo } from "react";
import {
  FileText,
  Printer,
  Edit,
  CheckCircle,
  ArrowRightCircle,
  Ban,
  Trash2,
  DollarSign,
  Receipt,
  CheckSquare,
} from "lucide-react";
import type { Sale } from "../../types";
import type { Column } from "@/shared/components/ui/Table";
import { SaleTypeBadge } from "../../components/table/SaleTypeBadge";
import { SalesStatusBadge, SalesPaidBadge } from "../../components/table";
import type { SalePaidStatus } from "../../types";

export interface UseSalesTableColumnsProps {
  onPreview: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
  onEdit: (id: string) => void;
  onConfirm: (sale: Sale) => void;
  onConvert: (sale: Sale) => void;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onUpdatePaidStatus?: (sale: Sale, newStatus: SalePaidStatus) => void;
  onOpenQuickPayment?: (sale: Sale) => void;
  onOpenCloseManual?: (sale: Sale) => void;
  onOpenPaymentsHistory?: (sale: Sale) => void;
}

export function useSalesTableColumns({
  onPreview,
  onPrint,
  onEdit,
  onConfirm,
  onConvert,
  onCancel,
  onDelete,
  onUpdatePaidStatus,
  onOpenQuickPayment,
  onOpenCloseManual,
  onOpenPaymentsHistory,
}: UseSalesTableColumnsProps): Column<Sale>[] {
  return useMemo(
    () => [
      {
        key: "saleNumber",
        title: "N° Documento",
        render: (sale: Sale) => (
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--color-text-primary)]">
              {sale.saleNumber}
            </span>
            {sale.convertedFromQuotationId && (
              <span className="text-[10px] text-[var(--color-text-muted)] italic">
                Desde cotización
              </span>
            )}
          </div>
        ),
      },
      {
        key: "saleType",
        title: "Tipo",
        render: (sale: Sale) => <SaleTypeBadge type={sale.saleType} />,
      },
      {
        key: "paymentTerm",
        title: "Condición",
        render: (sale: Sale) => {
          const isCredit = sale.paymentTerm === "CREDITO";
          return (
            <div className="flex flex-col text-xs">
              <span
                className={`font-semibold text-xs ${
                  isCredit
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isCredit ? "Crédito" : "Contado"}
              </span>
              {isCredit && sale.dueDate && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Vence: {new Date(sale.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "saleDate",
        title: "Fecha",
        render: (sale: Sale) => (
          <div className="flex flex-col text-xs text-[var(--color-text-secondary)]">
            <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
            {sale.saleType === "QUOTATION" && sale.validUntil && (
              <span className="text-[10px] text-amber-600 font-medium">
                Vence: {new Date(sale.validUntil).toLocaleDateString()}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "customerName",
        title: "Cliente",
        render: (sale: Sale) => (
          <div className="flex flex-col max-w-[180px] truncate">
            <span className="font-medium text-xs text-[var(--color-text-primary)] truncate">
              {sale.customerName}
            </span>
            {sale.customerTaxId && (
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {sale.customerTaxId}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "total",
        title: "Importe Total",
        align: "right",
        render: (sale: Sale) => (
          <div className="flex flex-col items-end">
            <span className="font-bold text-sm text-[var(--color-text-primary)]">
              ${sale.total.toFixed(2)}
            </span>
            <span className="text-[11px] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-medium">
              Bs. {sale.totalLocal.toFixed(2)}
            </span>
          </div>
        ),
      },
      {
        key: "paidStatus",
        title: "Estado Pago",
        align: "center",
        render: (sale: Sale) => {
          if (sale.saleType === "QUOTATION") {
            return (
              <span className="text-xs text-[var(--color-text-muted)] italic">
                N/A
              </span>
            );
          }
          return (
            <div className="flex items-center justify-center gap-1.5">
              <SalesPaidBadge paidStatus={sale.paidStatus} />
            </div>
          );
        },
      },
      {
        key: "status",
        title: "Estado Doc.",
        align: "center",
        render: (sale: Sale) => <SalesStatusBadge status={sale.status} />,
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (sale: Sale) => {
          const isQuotation = sale.saleType === "QUOTATION";
          const isCompleted = sale.status === "COMPLETED";
          const isCancelled = sale.status === "CANCELLED";

          return (
            <div className="flex items-center justify-end gap-1">
              {/* Ver detalle / modal */}
              <button
                type="button"
                onClick={() => onPreview(sale)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                title="Vista previa del comprobante"
              >
                <FileText className="w-4 h-4" />
              </button>

              {/* Imprimir PDF */}
              <button
                type="button"
                onClick={() => onPrint(sale)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                title="Imprimir PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Convertir cotización a venta directa */}
              {isQuotation && !isCancelled && (
                <button
                  type="button"
                  onClick={() => onConvert(sale)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Convertir cotización en Venta Directa"
                >
                  <ArrowRightCircle className="w-4 h-4" />
                </button>
              )}

              {/* Confirmar venta pendiente/borrador -> COMPLETED */}
              {!isQuotation && !isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() => onConfirm(sale)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Confirmar y completar venta (Emite evento para stock)"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {/* Registrar Cobro / Abono Directo */}
              {!isQuotation &&
                isCompleted &&
                sale.paidStatus !== "PAGADO" &&
                onOpenQuickPayment && (
                  <button
                    type="button"
                    onClick={() => onOpenQuickPayment(sale)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                    title="Registrar Cobro / Abono Directo"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                )}

              {/* Ver Historial de Pagos y Comprobantes */}
              {!isQuotation &&
                (sale.paidAmount > 0 || sale.paidStatus !== "PENDIENTE") &&
                onOpenPaymentsHistory && (
                  <button
                    type="button"
                    onClick={() => onOpenPaymentsHistory(sale)}
                    className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                    title="Ver Historial de Cobros y Comprobantes"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                )}

              {/* Cerrar Venta Manualmente con Diferencia */}
              {!isQuotation &&
                isCompleted &&
                sale.paidStatus === "ABONADO" &&
                onOpenCloseManual && (
                  <button
                    type="button"
                    onClick={() => onOpenCloseManual(sale)}
                    className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                    title="Cerrar venta manualmente por diferencia mínima"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                )}

              {/* Editar */}
              {!isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() => onEdit(sale.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                  title="Editar documento"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {/* Anular */}
              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => onCancel(sale)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Anular venta"
                >
                  <Ban className="w-4 h-4" />
                </button>
              )}

              {/* Eliminar (solo borrador o anulada) */}
              {(sale.status === "DRAFT" || isCancelled) && (
                <button
                  type="button"
                  onClick={() => onDelete(sale)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [
      onPreview,
      onPrint,
      onEdit,
      onConfirm,
      onConvert,
      onCancel,
      onDelete,
      onUpdatePaidStatus,
      onOpenQuickPayment,
      onOpenCloseManual,
      onOpenPaymentsHistory,
    ],
  );
}
