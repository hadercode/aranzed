import { DollarSign, Coins, TrendingUp } from 'lucide-react';

export interface CurrencyBreakdownValues {
  subtotal: number;
  discountAmount?: number;
  taxableSubtotal: number;
  exemptSubtotal: number;
  taxAmount: number;
  total: number;
}

export interface DualCurrencySummaryCardsProps {
  functionalBreakdown: CurrencyBreakdownValues;
  localBreakdown: CurrencyBreakdownValues;
  exchangeRate: number;
  functionalCurrency?: string;
  functionalSymbol?: string;
  localCurrency?: string;
  localSymbol?: string;
  taxLabel?: string;
  documentCurrency?: string;
  className?: string;
}

/**
 * Componente Global Reutilizable para Resúmenes Financieros Bimoneda.
 * Renderiza dos tarjetas comparativas (Moneda Funcional USD vs Moneda Local VES)
 * con desglose de Subtotal Neto, Base Gravada, Base Exenta, Impuesto y Total a Pagar.
 */
export function DualCurrencySummaryCards({
  functionalBreakdown,
  localBreakdown,
  exchangeRate,
  functionalCurrency = 'USD',
  functionalSymbol = '$',
  localCurrency = 'VES',
  localSymbol = 'Bs.',
  taxLabel = 'IVA (16%)',
  documentCurrency,
  className = '',
}: DualCurrencySummaryCardsProps) {
  const formattedRate = exchangeRate > 0
    ? exchangeRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
    : '1.00';

  const isFunctionalOrigin = documentCurrency === functionalCurrency || (!documentCurrency && true);
  const isLocalOrigin = documentCurrency === localCurrency;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${className}`}>
      {/* TARJETA 1: MONEDA FUNCIONAL (USD) */}
      <div className={`p-5 rounded-2xl bg-[var(--color-surface-card)] border shadow-sm transition-all space-y-4 ${
        isFunctionalOrigin ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' : 'border-[var(--color-border)] hover:border-emerald-500/30'
      }`}>
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                Moneda Funcional ({functionalCurrency})
              </h4>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Base referencial de costo y valor dura
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isFunctionalOrigin && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-wider shadow-xs">
                Moneda Factura
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {functionalCurrency} ({functionalSymbol})
            </span>
          </div>
        </div>

        {/* Desglose financiero */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
            <span>Subtotal Neto:</span>
            <span className="font-mono font-medium">
              {functionalSymbol}{functionalBreakdown.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {Boolean(functionalBreakdown.discountAmount && functionalBreakdown.discountAmount > 0) && (
            <div className="flex justify-between items-center text-rose-500 font-medium pl-2">
              <span>• Descuentos:</span>
              <span className="font-mono">
                -{functionalSymbol}{functionalBreakdown.discountAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-[var(--color-text-muted)] pl-2">
            <span>• Base Gravable:</span>
            <span className="font-mono">
              {functionalSymbol}{functionalBreakdown.taxableSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-[var(--color-text-muted)] pl-2">
            <span>• Base Exenta:</span>
            <span className="font-mono">
              {functionalSymbol}{functionalBreakdown.exemptSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium pt-1.5 border-t border-[var(--color-border)]">
            <span>{taxLabel}:</span>
            <span className="font-mono">
              +{functionalSymbol}{functionalBreakdown.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-[var(--color-text-primary)] pt-2.5 border-t-2 border-[var(--color-border)]">
            <span>Total Liquidado:</span>
            <span className="font-mono text-lg text-emerald-600 dark:text-emerald-400">
              {functionalSymbol}{functionalBreakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* TARJETA 2: MONEDA LOCAL (VES / Bolívares) */}
      <div className={`p-5 rounded-2xl bg-[var(--color-surface-card)] border shadow-sm transition-all space-y-4 ${
        isLocalOrigin ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-[var(--color-border)] hover:border-blue-500/30'
      }`}>
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                Moneda Local ({localCurrency})
              </h4>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Valor contable y fiscal en bolívares
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isLocalOrigin && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white uppercase tracking-wider shadow-xs">
                Moneda Factura
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-3 h-3" />
              1 {functionalSymbol} = {formattedRate} {localSymbol}
            </span>
          </div>
        </div>

        {/* Desglose financiero en moneda local */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
            <span>Subtotal Neto:</span>
            <span className="font-mono font-medium">
              {localSymbol} {localBreakdown.subtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {Boolean(localBreakdown.discountAmount && localBreakdown.discountAmount > 0) && (
            <div className="flex justify-between items-center text-rose-500 font-medium pl-2">
              <span>• Descuentos:</span>
              <span className="font-mono">
                -{localSymbol} {localBreakdown.discountAmount?.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-[var(--color-text-muted)] pl-2">
            <span>• Base Gravable:</span>
            <span className="font-mono">
              {localSymbol} {localBreakdown.taxableSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-[var(--color-text-muted)] pl-2">
            <span>• Base Exenta:</span>
            <span className="font-mono">
              {localSymbol} {localBreakdown.exemptSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-medium pt-1.5 border-t border-[var(--color-border)]">
            <span>{taxLabel}:</span>
            <span className="font-mono">
              +{localSymbol} {localBreakdown.taxAmount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-[var(--color-text-primary)] pt-2.5 border-t-2 border-[var(--color-border)]">
            <span>Total Liquidado:</span>
            <span className="font-mono text-lg text-blue-600 dark:text-blue-400">
              {localSymbol} {localBreakdown.total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DualCurrencySummaryCards;
