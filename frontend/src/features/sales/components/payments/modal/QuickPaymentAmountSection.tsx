import { ArrowRightLeft } from "lucide-react";
import type { Sale } from "../../../types";

interface QuickPaymentAmountSectionProps {
  sale: Sale;
  currency: "USD" | "VES";
  setCurrency: (c: "USD" | "VES") => void;
  amount: number;
  setAmount: (a: number) => void;
  pendingBalanceUsd: number;
  pendingBalanceVes: number;
  amountUsd: number;
  amountVes: number;
  exchangeRate: number;
  setExchangeRate: (r: number) => void;
}

export function QuickPaymentAmountSection({
  sale,
  currency,
  setCurrency,
  amount,
  setAmount,
  pendingBalanceUsd,
  pendingBalanceVes,
  amountUsd,
  amountVes,
  exchangeRate,
  setExchangeRate,
}: QuickPaymentAmountSectionProps) {
  return (
    <>
      {/* Resumen de Saldo */}
      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="text-[var(--color-text-muted)] block">Total Venta:</span>
          <span className="text-sm font-bold text-[var(--color-text-primary)]">
            ${sale.total.toFixed(2)}{" "}
            <span className="text-xs font-normal text-[var(--color-text-muted)]">
              (Bs. {sale.totalLocal.toFixed(2)})
            </span>
          </span>
        </div>
        <div className="text-right">
          <span className="text-[var(--color-text-muted)] block">Saldo Pendiente:</span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            ${pendingBalanceUsd.toFixed(2)}{" "}
            <span className="text-xs font-normal text-[var(--color-text-muted)]">
              (Bs. {pendingBalanceVes.toFixed(2)})
            </span>
          </span>
        </div>
      </div>

      {/* Moneda y Monto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Moneda del Pago
          </label>
          <div className="flex rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] p-1">
            <button
              type="button"
              onClick={() => {
                setCurrency("USD");
                setAmount(pendingBalanceUsd);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === "USD"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrency("VES");
                setAmount(pendingBalanceVes);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === "VES"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Bs. VES
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="quick-pay-amount"
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Monto a Cobrar ({currency === "USD" ? "$" : "Bs."})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
              {currency === "USD" ? "$" : "Bs."}
            </span>
            <input
              id="quick-pay-amount"
              type="number"
              step="any"
              min="0"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Tasa y Equivalencia */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-sage-500/5 border border-sage-500/10 text-xs">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-sage-600" />
          <span className="text-[var(--color-text-muted)]">Equivale a:</span>
          <strong className="text-emerald-600 font-bold">
            ${amountUsd.toFixed(2)} USD
          </strong>
          <span className="text-[var(--color-text-muted)]">&bull;</span>
          <strong className="text-blue-600 font-bold">
            Bs. {amountVes.toFixed(2)} VES
          </strong>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
          <span>Tasa:</span>
          <input
            type="number"
            step="any"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
            className="w-16 px-1.5 py-0.5 rounded bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-right font-mono"
          />
        </div>
      </div>
    </>
  );
}

