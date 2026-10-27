import { useMemo } from 'react';
import type { CurrencyBreakdownValues } from '@/shared/components/ui/DualCurrencySummaryCards';
import { useCurrencyStore } from '@/shared/hooks/store';

export interface PurchaseCalculationsItemInput {
  quantity: number;
  unitCost: number;
  isTaxable?: boolean;
  taxRate?: number;
}

export interface PurchaseBreakdown {
  functional: CurrencyBreakdownValues;
  local: CurrencyBreakdownValues;
  itemsCount: number;
  totalUnits: number;
  exchangeRate: number;
  documentCurrency: string;
}

export interface UsePurchaseCalculationsProps {
  items: PurchaseCalculationsItemInput[];
  exchangeRate?: number;
  documentCurrency?: string;
  localCurrency?: string;
}

/**
 * Hook puro para el cálculo financiero bimoneda de la compra de materiales:
 * - Soporta origen de factura en Moneda Funcional o Moneda Local configurada globalmente
 * - Convierte reactivamente en ambas direcciones con base en exchangeRate
 */
export function usePurchaseCalculations({
  items,
  exchangeRate = 1.0,
  documentCurrency,
  localCurrency,
}: UsePurchaseCalculationsProps): {
  breakdown: PurchaseBreakdown;
} {
  const storeLocal = useCurrencyStore((s) => s.localCurrency);
  const storeFunctional = useCurrencyStore((s) => s.functionalCurrency);

  const resolvedLocal = localCurrency || storeLocal;
  const resolvedDocCurrency = documentCurrency || storeFunctional;

  const breakdown = useMemo<PurchaseBreakdown>(() => {
    const rate = exchangeRate && exchangeRate > 0 ? exchangeRate : 1.0;
    const isLocal = resolvedDocCurrency === resolvedLocal;

    let subtotalFunctional = 0;
    let taxableSubtotalFunctional = 0;
    let exemptSubtotalFunctional = 0;
    let taxAmountFunctional = 0;

    let subtotalLocal = 0;
    let taxableSubtotalLocal = 0;
    let exemptSubtotalLocal = 0;
    let taxAmountLocal = 0;

    let totalUnits = 0;

    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      const costInput = Number(item.unitCost) || 0;
      totalUnits += qty;

      const isTaxable = item.isTaxable !== false;
      const taxRate = isTaxable ? (Number(item.taxRate) > 0 ? Number(item.taxRate) : 16.0) : 0;

      if (isLocal) {
        // La moneda física del comprobante es la Moneda Local
        const lineSubtotalLocal = Number((qty * costInput).toFixed(4));
        subtotalLocal += lineSubtotalLocal;

        const lineSubtotalFunctional = Number((lineSubtotalLocal / rate).toFixed(4));
        subtotalFunctional += lineSubtotalFunctional;

        if (isTaxable) {
          taxableSubtotalLocal += lineSubtotalLocal;
          const lineTaxLocal = Number(((lineSubtotalLocal * taxRate) / 100).toFixed(4));
          taxAmountLocal += lineTaxLocal;

          taxableSubtotalFunctional += lineSubtotalFunctional;
          const lineTaxFunctional = Number(((lineSubtotalFunctional * taxRate) / 100).toFixed(4));
          taxAmountFunctional += lineTaxFunctional;
        } else {
          exemptSubtotalLocal += lineSubtotalLocal;
          exemptSubtotalFunctional += lineSubtotalFunctional;
        }
      } else {
        // La moneda física del comprobante es la Moneda Funcional
        const lineSubtotalFunctional = Number((qty * costInput).toFixed(4));
        subtotalFunctional += lineSubtotalFunctional;

        const lineSubtotalLocal = Number((lineSubtotalFunctional * rate).toFixed(4));
        subtotalLocal += lineSubtotalLocal;

        if (isTaxable) {
          taxableSubtotalFunctional += lineSubtotalFunctional;
          const lineTaxFunctional = Number(((lineSubtotalFunctional * taxRate) / 100).toFixed(4));
          taxAmountFunctional += lineTaxFunctional;

          taxableSubtotalLocal += lineSubtotalLocal;
          const lineTaxLocal = Number(((lineSubtotalLocal * taxRate) / 100).toFixed(4));
          taxAmountLocal += lineTaxLocal;
        } else {
          exemptSubtotalFunctional += lineSubtotalFunctional;
          exemptSubtotalLocal += lineSubtotalLocal;
        }
      }
    }

    const totalFunctional = Number((subtotalFunctional + taxAmountFunctional).toFixed(4));
    const totalLocal = Number((subtotalLocal + taxAmountLocal).toFixed(4));

    return {
      functional: {
        subtotal: Number(subtotalFunctional.toFixed(2)),
        taxableSubtotal: Number(taxableSubtotalFunctional.toFixed(2)),
        exemptSubtotal: Number(exemptSubtotalFunctional.toFixed(2)),
        taxAmount: Number(taxAmountFunctional.toFixed(2)),
        total: Number(totalFunctional.toFixed(2)),
      },
      local: {
        subtotal: Number(subtotalLocal.toFixed(2)),
        taxableSubtotal: Number(taxableSubtotalLocal.toFixed(2)),
        exemptSubtotal: Number(exemptSubtotalLocal.toFixed(2)),
        taxAmount: Number(taxAmountLocal.toFixed(2)),
        total: Number(totalLocal.toFixed(2)),
      },
      itemsCount: items.length,
      totalUnits: Number(totalUnits.toFixed(2)),
      exchangeRate: rate,
      documentCurrency: resolvedDocCurrency,
    };
  }, [items, exchangeRate, resolvedDocCurrency, resolvedLocal]);

  return { breakdown };
}
