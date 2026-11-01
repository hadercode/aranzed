import { DollarSign, Calendar, Clock, AlertTriangle } from "lucide-react";
import type { Sale } from "../../../types";

interface WhatsAppFinancialSummaryCardsProps {
  sale: Sale;
  reminderData: {
    formattedUSD: string;
    formattedVES?: string | null;
    dueDateFormatted: string;
    isOverdue: boolean;
    daysOverdue: number;
  };
}

export function WhatsAppFinancialSummaryCards({
  sale,
  reminderData,
}: WhatsAppFinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Monto Pendiente */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Monto Pendiente</span>
        </div>
        <div className="font-bold text-base text-[var(--color-text-primary)]">
          {reminderData.formattedUSD}
        </div>
        {reminderData.formattedVES && (
          <div className="text-xs text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-medium">
            {reminderData.formattedVES}
          </div>
        )}
      </div>

      {/* Fecha de Vencimiento */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
          <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Vencimiento</span>
        </div>
        <div className="font-bold text-sm text-[var(--color-text-primary)]">
          {reminderData.dueDateFormatted}
        </div>
        <div className="text-[11px] text-[var(--color-text-muted)]">
          {sale.paymentTerm === "CREDITO" ? "Venta a Crédito" : "Condición Contado"}
        </div>
      </div>

      {/* Días de Antigüedad / Estado */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
          <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Antigüedad / Estado</span>
        </div>
        {sale.dueDate ? (
          reminderData.isOverdue ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Vencida hace {reminderData.daysOverdue} d</span>
            </div>
          ) : reminderData.daysOverdue === 0 ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <span>Vence hoy</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <span>En plazo ({Math.abs(reminderData.daysOverdue)} d restantes)</span>
            </div>
          )
        ) : (
          <span className="text-xs text-[var(--color-text-muted)] italic">
            Pendiente de cobro
          </span>
        )}
        <div className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
          Doc: #{sale.saleNumber}
        </div>
      </div>
    </div>
  );
}
