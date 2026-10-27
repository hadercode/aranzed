import { TrendingUp, AlertTriangle } from 'lucide-react';
import { useSalesFormContext } from '../../../context';
import {
  DocumentSummarySection,
  type DocumentSummarySectionProps,
} from '@/shared/components/ui';

export interface SaleSummarySectionProps
  extends Partial<DocumentSummarySectionProps> {}

/**
 * Sección de Liquidación y Resumen Financiero para Ventas.
 * Consume reactivamente useSalesFormContext y delega la presentación
 * al componente global compartido DocumentSummarySection, incorporando
 * un widget contextual de Análisis de Rentabilidad Comercial y Margen Bruto.
 */
export function SaleSummarySection(props: SaleSummarySectionProps = {}) {
  const { form } = useSalesFormContext();
  const { financials, watchedRate, watch } = form;

  const currentStatus = watch('status');
  const activeFunctional = watch('functionalCurrency');
  const activeLocal = watch('localCurrency');
  const documentCurrency = watch('documentCurrency');

  const isMarginNegative = financials.grossProfitUSD < 0;

  return (
    <DocumentSummarySection
      functionalBreakdown={props.functionalBreakdown ?? financials.functional}
      localBreakdown={props.localBreakdown ?? financials.local}
      exchangeRate={props.exchangeRate ?? watchedRate}
      documentCurrency={props.documentCurrency ?? documentCurrency}
      functionalCurrency={props.functionalCurrency ?? activeFunctional}
      localCurrency={props.localCurrency ?? activeLocal}
      itemsCount={props.itemsCount ?? financials.itemsCount}
      totalUnits={props.totalUnits ?? financials.totalUnits}
      inventory={{
        moduleType: 'sale',
        status: currentStatus,
        ...props.inventory,
      }}
      className={props.className}
    >
      {/* Análisis de Margen y Rentabilidad Comercial */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Análisis de Rentabilidad Comercial
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Margen bruto estimado en tiempo real frente al costo unitario de reposición
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-[var(--color-text-muted)] block">
              Margen Bruto Estimado
            </span>
            <span
              className={`text-base font-bold font-mono ${
                isMarginNegative ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              ${financials.grossProfitUSD.toFixed(2)} ({financials.profitMarginPercent}%)
            </span>
          </div>

          {isMarginNegative && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Precio por debajo del costo</span>
            </div>
          )}
        </div>
      </div>

      {props.children}
    </DocumentSummarySection>
  );
}

export default SaleSummarySection;
