import {
  DollarSign,
  Receipt,
  CheckSquare,
  ArrowRightCircle,
  CheckCircle,
} from "lucide-react";
import type { Sale } from "../../types";
import { WhatsAppIcon } from "../payments/modal/SaleWhatsAppReminderModal";

interface SalePaymentActionsProps {
  sale: Sale;
  hasPendingBalance: boolean;
  isOverdue: boolean;
  isQuotation: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
  onExecute: (action: () => void) => void;
  onWhatsAppReminder: (sale: Sale) => void;
  onOpenQuickPayment?: (sale: Sale) => void;
  onOpenPaymentsHistory?: (sale: Sale) => void;
  onOpenCloseManual?: (sale: Sale) => void;
  onConvert: (sale: Sale) => void;
  onConfirm: (sale: Sale) => void;
}

export function SalePaymentActions({
  sale,
  hasPendingBalance,
  isOverdue,
  isQuotation,
  isCompleted,
  isCancelled,
  onExecute,
  onWhatsAppReminder,
  onOpenQuickPayment,
  onOpenPaymentsHistory,
  onOpenCloseManual,
  onConvert,
  onConfirm,
}: SalePaymentActionsProps) {
  return (
    <div className="py-1">
      {/* Notificación de Cobro por WhatsApp */}
      {hasPendingBalance && (
        <button
          type="button"
          onClick={() => onExecute(() => onWhatsAppReminder(sale))}
          className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer font-medium"
        >
          <div className="flex items-center gap-2.5">
            <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Notificar Cobro (WhatsApp)</span>
          </div>
          {isOverdue && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
              Vencida
            </span>
          )}
        </button>
      )}

      {/* Registrar Cobro / Abono Directo */}
      {!isQuotation &&
        isCompleted &&
        sale.paidStatus !== "PAGADO" &&
        onOpenQuickPayment && (
          <button
            type="button"
            onClick={() => onExecute(() => onOpenQuickPayment(sale))}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
          >
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Registrar Cobro / Abono</span>
          </button>
        )}

      {/* Historial de Pagos */}
      {!isQuotation &&
        ((sale.paidAmount && sale.paidAmount > 0) || sale.paidStatus !== "PENDIENTE") &&
        onOpenPaymentsHistory && (
          <button
            type="button"
            onClick={() => onExecute(() => onOpenPaymentsHistory(sale))}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <Receipt className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Historial de Cobros</span>
          </button>
        )}

      {/* Cerrar Venta Manualmente con Diferencia */}
      {!isQuotation &&
        isCompleted &&
        sale.paidStatus === "ABONADO" &&
        onOpenCloseManual && (
          <button
            type="button"
            onClick={() => onExecute(() => onOpenCloseManual(sale))}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-amber-600 dark:text-amber-400 font-medium"
          >
            <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Cerrar con Diferencia Mínima</span>
          </button>
        )}

      {/* Convertir cotización a venta directa */}
      {isQuotation && !isCancelled && (
        <button
          type="button"
          onClick={() => onExecute(() => onConvert(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
        >
          <ArrowRightCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Convertir a Venta Directa</span>
        </button>
      )}

      {/* Confirmar venta pendiente/borrador -> COMPLETED */}
      {!isQuotation && !isCompleted && !isCancelled && (
        <button
          type="button"
          onClick={() => onExecute(() => onConfirm(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
        >
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Confirmar y Completar Venta</span>
        </button>
      )}
    </div>
  );
}

