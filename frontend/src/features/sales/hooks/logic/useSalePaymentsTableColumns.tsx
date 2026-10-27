import { useMemo } from 'react';
import type { Column } from '@/shared/components/ui/Table';
import { Eye, Ban, FileText, CheckCircle2 } from 'lucide-react';
import type { SalePayment } from '../../types';

interface UseSalePaymentsTableColumnsOptions {
  onOpenReceipt: (url: string) => void;
  onOpenCancel: (payment: SalePayment) => void;
}

export function useSalePaymentsTableColumns({
  onOpenReceipt,
  onOpenCancel,
}: UseSalePaymentsTableColumnsOptions): Column<SalePayment>[] {
  return useMemo<Column<SalePayment>[]>(() => [
    {
      key: 'paymentNumber',
      title: 'Cobro / Ref',
      render: (p: SalePayment) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sage-50 dark:bg-sage-950/50 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
            {p.paymentNumber}
          </span>
          {p.reference && (
            <p className="text-[11px] text-[var(--color-text-muted)] font-mono">
              Ref: {p.reference}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'customerName',
      title: 'Cliente',
      render: (p: SalePayment) => (
        <div>
          <p className="font-medium text-sm text-[var(--color-text-primary)]">
            {p.customerName || 'Cliente General'}
          </p>
          {p.customerTaxId && (
            <p className="text-xs text-[var(--color-text-muted)]">
              {p.customerTaxId}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'paymentDate',
      title: 'Fecha',
      render: (p: SalePayment) => {
        const d = p.paymentDate ? new Date(p.paymentDate) : null;
        return (
          <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
            {d ? d.toLocaleDateString() : '-'}
          </span>
        );
      },
    },
    {
      key: 'paymentMethod',
      title: 'Método',
      render: (p: SalePayment) => {
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
          OTHER: {
            label: 'Otro',
            color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
          },
        };
        const m = methodLabels[p.paymentMethod] || {
          label: p.paymentMethod,
          color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
        };
        return (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${m.color}`}
          >
            {m.label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      title: 'Monto Cobrado',
      align: 'right',
      render: (p: SalePayment) => (
        <div className="text-right">
          <p className="font-bold text-sm text-[var(--color-text-primary)]">
            ${Number(p.amount || 0).toFixed(2)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">
            Bs. {Number(p.amountLocal || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      key: 'receiptUrl',
      title: 'Comprobante',
      align: 'center',
      render: (p: SalePayment) => {
        if (!p.receiptUrl) {
          return (
            <span className="text-xs text-[var(--color-text-muted)] italic">
              Sin adjunto
            </span>
          );
        }
        const isPdf = p.receiptUrl.toLowerCase().endsWith('.pdf');
        return (
          <button
            type="button"
            onClick={() => onOpenReceipt(p.receiptUrl!)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm transition-all"
            title="Ver comprobante"
          >
            {isPdf ? (
              <FileText className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>Ver</span>
          </button>
        );
      },
    },
    {
      key: 'status',
      title: 'Estado',
      render: (p: SalePayment) => {
        const isConfirmed = p.status === 'CONFIRMED';
        return (
          <div className="space-y-0.5">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${
                isConfirmed
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 line-through'
              }`}
            >
              {isConfirmed ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Ban className="w-3 h-3" />
              )}
              {isConfirmed ? 'APLICADO' : 'ANULADO'}
            </span>
            {p.cancelReason && (
              <p
                className="text-[10px] text-rose-500 italic max-w-xs truncate"
                title={p.cancelReason}
              >
                Motivo: {p.cancelReason}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'allocations',
      title: 'Ventas Cruzadas',
      render: (p: SalePayment) => {
        const count = p.allocations?.length || 0;
        return (
          <div className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              {count} {count === 1 ? 'venta' : 'ventas'}
            </span>
            {count > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                {p.allocations?.slice(0, 3).map((a) => (
                  <span
                    key={a.id || a.saleId}
                    className="font-mono text-[10px] px-1.5 py-0.5 bg-[var(--color-surface-card)] rounded border border-[var(--color-border)] text-[var(--color-text-muted)]"
                  >
                    ${Number(a.amountAllocated || 0).toFixed(2)}
                  </span>
                ))}
                {count > 3 && (
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    +{count - 3} más
                  </span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Acciones',
      align: 'center',
      render: (p: SalePayment) => {
        if (p.status !== 'CONFIRMED') {
          return (
            <span className="text-xs text-[var(--color-text-muted)] italic">
              Sin acciones
            </span>
          );
        }
        return (
          <button
            type="button"
            onClick={() => onOpenCancel(p)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Anular cobro y revertir saldos"
          >
            <Ban className="w-4 h-4" />
          </button>
        );
      },
    },
  ], [onOpenReceipt, onOpenCancel]);
}
