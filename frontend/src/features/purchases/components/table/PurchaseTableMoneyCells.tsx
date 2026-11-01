import type { Purchase } from '../../types';

export function PurchaseNumberCell({
  purchase,
  localCurrency,
  localSymbol,
  functionalCurrency,
  functionalSymbol,
}: {
  purchase: Purchase;
  localCurrency: string;
  localSymbol: string;
  functionalCurrency: string;
  functionalSymbol: string;
}) {
  const isDocLocal = purchase.documentCurrency === (purchase.localCurrency || localCurrency);
  return (
    <div className="font-mono text-xs">
      <div className="font-semibold text-emerald-600 dark:text-emerald-400">{purchase.purchaseNumber}</div>
      <span
        className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
          isDocLocal
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
        }`}
      >
        Factura {isDocLocal ? `${localSymbol} (${localCurrency})` : `${functionalSymbol} (${functionalCurrency})`}
      </span>
    </div>
  );
}

export function PurchaseSubtotalCell({
  purchase,
  functionalSymbol,
  localSymbol,
}: {
  purchase: Purchase;
  functionalSymbol: string;
  localSymbol: string;
}) {
  const rate = Number(purchase.exchangeRate) || 1.0;
  const subtotalLocal =
    purchase.subtotalLocal !== undefined ? Number(purchase.subtotalLocal) : Number(purchase.subtotal) * rate;

  return (
    <div className="text-xs font-mono">
      <div>
        {functionalSymbol}{' '}
        {Number(purchase.subtotal).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <div className="text-[10px] text-blue-600 dark:text-blue-400">
        {localSymbol}{' '}
        {subtotalLocal.toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

export function PurchaseTotalCell({
  purchase,
  functionalSymbol,
  localSymbol,
}: {
  purchase: Purchase;
  functionalSymbol: string;
  localSymbol: string;
}) {
  const rate = Number(purchase.exchangeRate) || 1.0;
  const totalLocal =
    purchase.totalLocal !== undefined ? Number(purchase.totalLocal) : Number(purchase.total) * rate;

  return (
    <div className="font-mono">
      <div className="font-bold text-sm text-[var(--color-text-primary)]">
        {functionalSymbol}{' '}
        {Number(purchase.total).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
        {localSymbol}{' '}
        {totalLocal.toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

