import { DollarSign, ArrowRightLeft } from 'lucide-react';

export interface PaymentAmountSectionProps {
  currency: 'USD' | 'VES';
  onCurrencyChange: (val: 'USD' | 'VES') => void;
  totalPaymentAmount: number;
  onTotalPaymentAmountChange: (val: number) => void;
  exchangeRate: number;
  onExchangeRateChange: (val: number) => void;
  totalAmountUsd: number;
  totalAmountVes: number;
}

export function PaymentAmountSection({
  currency,
  onCurrencyChange,
  totalPaymentAmount,
  onTotalPaymentAmountChange,
  exchangeRate,
  onExchangeRateChange,
  totalAmountUsd,
  totalAmountVes,
}: PaymentAmountSectionProps) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Monto del Cobro y Moneda
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Indica la moneda real recibida y la tasa de cambio aplicada
            </p>
          </div>
        </div>

        {/* Selector de Moneda */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => onCurrencyChange('USD')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              currency === 'USD'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Dólares ($ USD)
          </button>
          <button
            type="button"
            onClick={() => onCurrencyChange('VES')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              currency === 'VES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Bolívares (Bs VES)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monto Recibido */}
        <div className="space-y-1.5">
          <label
            htmlFor="total-payment-amount-input"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Monto Total Recibido ({currency === 'USD' ? '$ USD' : 'Bs VES'})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[var(--color-text-muted)]">
              {currency === 'USD' ? '$' : 'Bs.'}
            </span>
            <input
              id="total-payment-amount-input"
              type="number"
              step="any"
              min="0"
              value={totalPaymentAmount === 0 ? '' : totalPaymentAmount}
              onChange={(e) =>
                onTotalPaymentAmountChange(Math.max(0, parseFloat(e.target.value) || 0))
              }
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2.5 text-base font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tasa de Cambio */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-exchange-rate-input"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Tasa de Cambio (Bs / USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--color-text-muted)]">
              Bs.
            </span>
            <input
              id="payment-exchange-rate-input"
              type="number"
              step="any"
              min="0.0001"
              value={exchangeRate === 0 ? '' : exchangeRate}
              onChange={(e) =>
                onExchangeRateChange(Math.max(0.0001, parseFloat(e.target.value) || 1.0))
              }
              placeholder="Tasa BCV"
              className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>
        </div>
      </div>

      {/* Tarjeta de Conversión Bimonetaria */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl bg-sage-500/5 border border-sage-500/10 gap-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-sage-600" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            Equivalencia de Cobro:
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[var(--color-text-muted)] mr-1">USD:</span>
            <strong className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
              ${totalAmountUsd.toFixed(2)}
            </strong>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <div>
            <span className="text-[var(--color-text-muted)] mr-1">VES:</span>
            <strong className="text-sm text-blue-600 dark:text-blue-400 font-bold">
              Bs. {totalAmountVes.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
