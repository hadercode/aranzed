import { DollarSign } from 'lucide-react';
import { PaymentEquivalenceBanner } from './PaymentEquivalenceBanner';

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
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
              Monto del Cobro y Moneda
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Indica la moneda real recibida y la tasa aplicada para el cruce
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onCurrencyChange('USD')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
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
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              currency === 'VES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Bolívares (Bs VES)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Monto Total Recibido */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="total-payment-amount-input"
              className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)]"
            >
              Monto Total Recibido ({currency === 'USD' ? '$ USD' : 'Bs VES'})
            </label>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Pago recibido en {currency}
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400 pointer-events-none">
              {currency === 'USD' ? '$' : 'Bs.'}
            </span>
            <input
              id="total-payment-amount-input"
              type="number"
              step="any"
              min="0"
              value={totalPaymentAmount === 0 ? '' : totalPaymentAmount}
              onChange={(e) => onTotalPaymentAmountChange(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0.00"
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-lg sm:text-xl font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Tasa de Cambio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="payment-exchange-rate-input"
              className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)]"
            >
              Tasa de Cambio (Bs / USD)
            </label>
            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
              Tasa BCV o pactada
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-[var(--color-text-muted)] pointer-events-none">
              Bs.
            </span>
            <input
              id="payment-exchange-rate-input"
              type="number"
              step="any"
              min="0.0001"
              value={exchangeRate === 0 ? '' : exchangeRate}
              onChange={(e) => onExchangeRateChange(Math.max(0.0001, parseFloat(e.target.value) || 1.0))}
              placeholder="Tasa BCV"
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-base sm:text-lg font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
            />
          </div>
        </div>
      </div>

      <PaymentEquivalenceBanner totalAmountUsd={totalAmountUsd} totalAmountVes={totalAmountVes} />
    </div>
  );
}
