import { Eye, FileText, CheckCircle2, Ban } from 'lucide-react';
import type { SalePayment } from '../../../types';

const methodLabels: Record<string, { label: string; color: string }> = {
  CASH_USD: {
    label: 'Efectivo $',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  CASH_VES: {
    label: 'Efectivo Bs',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  TRANSFER: {
    label: 'Transferencia',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  MOBILE_PAY: {
    label: 'Pago Móvil',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  POS: {
    label: 'Punto de Venta',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  ZELLE: {
    label: 'Zelle',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  CARD: {
    label: 'Tarjeta',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  ADJUSTMENT: {
    label: 'Ajuste Manual',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  OTHER: {
    label: 'Otro',
    color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  },
};

export function SalePaymentMethodBadge({ method }: { method: string }) {
  const m = methodLabels[method] || {
    label: method,
    color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${m.color}`}>{m.label}</span>;
}

export function SalePaymentReceiptButton({
  receiptUrl,
  onOpenReceipt,
}: {
  receiptUrl?: string | null;
  onOpenReceipt: (url: string) => void;
}) {
  if (!receiptUrl) {
    return <span className="text-xs text-[var(--color-text-muted)] italic">Sin adjunto</span>;
  }
  const isPdf = receiptUrl.toLowerCase().endsWith('.pdf');
  return (
    <button
      type="button"
      onClick={() => onOpenReceipt(receiptUrl)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm transition-all"
      title="Ver comprobante"
    >
      {isPdf ? <FileText className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5 text-blue-500" />}
      <span>Ver</span>
    </button>
  );
}

export function SalePaymentStatusBadge({ payment }: { payment: SalePayment }) {
  const isConfirmed = payment.status === 'CONFIRMED';
  return (
    <div className="space-y-0.5">
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${
          isConfirmed
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 line-through'
        }`}
      >
        {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
        {isConfirmed ? 'APLICADO' : 'ANULADO'}
      </span>
      {payment.cancelReason && (
        <p className="text-[10px] text-rose-500 italic max-w-xs truncate" title={payment.cancelReason}>
          Motivo: {payment.cancelReason}
        </p>
      )}
    </div>
  );
}

export function SalePaymentAllocationsCell({ payment }: { payment: SalePayment }) {
  const count = payment.allocations?.length || 0;
  return (
    <div className="text-xs text-[var(--color-text-secondary)]">
      <span className="font-semibold text-[var(--color-text-primary)]">
        {count} {count === 1 ? 'venta' : 'ventas'}
      </span>
      {count > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
          {payment.allocations?.slice(0, 3).map((a) => (
            <span
              key={a.id || a.saleId}
              className="font-mono text-[10px] px-1.5 py-0.5 bg-[var(--color-surface-card)] rounded border border-[var(--color-border)] text-[var(--color-text-muted)]"
            >
              ${Number(a.amountAllocated || 0).toFixed(2)}
            </span>
          ))}
          {count > 3 && <span className="text-[10px] text-[var(--color-text-muted)]">+{count - 3} más</span>}
        </div>
      )}
    </div>
  );
}
