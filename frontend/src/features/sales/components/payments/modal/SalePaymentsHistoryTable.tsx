import { Eye, FileText, CheckCircle2, Ban } from "lucide-react";
import type { SalePayment } from "../../../types";

interface SalePaymentsHistoryTableProps {
  payments: SalePayment[];
  saleId: string;
  onOpenReceipt: (url: string) => void;
}

export function SalePaymentsHistoryTable({
  payments,
  saleId,
  onOpenReceipt,
}: SalePaymentsHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
            <th className="py-2.5 px-3 font-semibold">Nº Cobro</th>
            <th className="py-2.5 px-3 font-semibold">Fecha</th>
            <th className="py-2.5 px-3 font-semibold">Método / Ref</th>
            <th className="py-2.5 px-3 font-semibold text-right">Imputado ($)</th>
            <th className="py-2.5 px-3 font-semibold text-center">Comprobante</th>
            <th className="py-2.5 px-3 font-semibold text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {payments.map((p) => {
            const thisAlloc = p.allocations?.find((a) => a.saleId === saleId);
            const allocatedAmount = thisAlloc ? thisAlloc.amountAllocated : p.amount;
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
                  {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-"}
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
                      onClick={() => onOpenReceipt(p.receiptUrl!)}
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
  );
}

