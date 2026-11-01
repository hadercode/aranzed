import { useMemo } from 'react';
import type { Column } from '@/shared/components/ui/Table';
import { Ban } from 'lucide-react';
import type { SalePayment } from '../../types';
import {
  SalePaymentMethodBadge,
  SalePaymentReceiptButton,
  SalePaymentStatusBadge,
  SalePaymentAllocationsCell,
} from '../../components/payments/table/SalePaymentTableCells';

interface UseSalePaymentsTableColumnsOptions {
  onOpenReceipt: (url: string) => void;
  onOpenCancel: (payment: SalePayment) => void;
}

export function useSalePaymentsTableColumns({
  onOpenReceipt,
  onOpenCancel,
}: UseSalePaymentsTableColumnsOptions): Column<SalePayment>[] {
  return useMemo<Column<SalePayment>[]>(
    () => [
      {
        key: 'paymentNumber',
        title: 'Cobro / Ref',
        render: (p: SalePayment) => (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sage-50 dark:bg-sage-950/50 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
              {p.paymentNumber}
            </span>
            {p.reference && (
              <p className="text-[11px] text-[var(--color-text-muted)] font-mono">Ref: {p.reference}</p>
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
              <p className="text-xs text-[var(--color-text-muted)]">{p.customerTaxId}</p>
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
        render: (p: SalePayment) => <SalePaymentMethodBadge method={p.paymentMethod} />,
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
        render: (p: SalePayment) => (
          <SalePaymentReceiptButton receiptUrl={p.receiptUrl} onOpenReceipt={onOpenReceipt} />
        ),
      },
      {
        key: 'status',
        title: 'Estado',
        render: (p: SalePayment) => <SalePaymentStatusBadge payment={p} />,
      },
      {
        key: 'allocations',
        title: 'Ventas Cruzadas',
        render: (p: SalePayment) => <SalePaymentAllocationsCell payment={p} />,
      },
      {
        key: 'actions',
        title: 'Acciones',
        align: 'center',
        render: (p: SalePayment) => {
          if (p.status !== 'CONFIRMED') {
            return <span className="text-xs text-[var(--color-text-muted)] italic">Sin acciones</span>;
          }
          return (
            <button
              type="button"
              onClick={() => onOpenCancel(p)}
              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Anular cobro y revertir saldos"
            >
              <Ban className="w-4 h-4" />
            </button>
          );
        },
      },
    ],
    [onOpenReceipt, onOpenCancel]
  );
}

export default useSalePaymentsTableColumns;
