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

