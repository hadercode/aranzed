import type { Sale } from '../../types';

export function SaleNumberCell({ sale }: { sale: Sale }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-[var(--color-text-primary)]">{sale.saleNumber}</span>
      {sale.convertedFromQuotationId && (
        <span className="text-[10px] text-[var(--color-text-muted)] italic">Desde cotización</span>
      )}
    </div>
  );
}

export function SalePaymentTermCell({ sale }: { sale: Sale }) {
  const isCredit = sale.paymentTerm === 'CREDITO';
  return (
    <div className="flex flex-col text-xs">
      <span
        className={`font-semibold text-xs ${
          isCredit ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {isCredit ? 'Crédito' : 'Contado'}
      </span>
      {isCredit && sale.dueDate && (
        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
          Vence: {new Date(sale.dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

export function SaleDateCell({ sale }: { sale: Sale }) {
  return (
    <div className="flex flex-col text-xs text-[var(--color-text-secondary)]">
      <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
      {sale.saleType === 'QUOTATION' && sale.validUntil && (
        <span className="text-[10px] text-amber-600 font-medium">
          Vence: {new Date(sale.validUntil).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

export function SaleCustomerCell({ sale }: { sale: Sale }) {
  return (
    <div className="flex flex-col max-w-[180px] truncate">
      <span className="font-medium text-xs text-[var(--color-text-primary)] truncate">
        {sale.customerName}
      </span>
      {sale.customerTaxId && (
        <span className="text-[11px] text-[var(--color-text-muted)]">{sale.customerTaxId}</span>
      )}
    </div>
  );
}

export function SaleTotalAmountCell({ sale }: { sale: Sale }) {
  return (
    <div className="flex flex-col items-end">
      <span className="font-bold text-sm text-[var(--color-text-primary)]">${sale.total.toFixed(2)}</span>
      <span className="text-[11px] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-medium">
        Bs. {sale.totalLocal.toFixed(2)}
      </span>
    </div>
  );
}

export function SaleBalanceCell({ sale }: { sale: Sale }) {
  if (sale.saleType === 'QUOTATION') {
    return <span className="text-xs text-[var(--color-text-muted)] italic">N/A</span>;
  }

  const balance = sale.balance ?? Math.max(0, sale.total - (sale.paidAmount || 0));
  const balanceLocal =
    sale.balanceLocal ?? Math.max(0, sale.totalLocal - (sale.paidAmountLocal || 0));
  const isPaid = sale.paidStatus === 'PAGADO' || balance <= 0.0001;

  if (isPaid) {
    return (
      <div className="flex flex-col items-end">
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          $0.00
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)]">
          Al día
        </span>
      </div>
    );
  }

  const isPartiallyPaid = (sale.paidAmount || 0) > 0;

  return (
    <div className="flex flex-col items-end">
      <span
        className={`font-bold text-xs ${
          isPartiallyPaid
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-rose-600 dark:text-rose-400'
        }`}
      >
        ${balance.toFixed(2)}
      </span>
      <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
        Bs. {balanceLocal.toFixed(2)}
      </span>
    </div>
  );
}
