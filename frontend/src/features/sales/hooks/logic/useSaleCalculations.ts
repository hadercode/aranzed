import { useMemo } from 'react';
import type { SaleItemFormData } from '../../schemas';
import type { CurrencyBreakdownValues } from '@/shared/components/ui';

export interface SaleFinancialsBreakdown {
  subtotalUSD: number;
  discountAmountUSD: number;
  taxableSubtotalUSD: number;
  exemptSubtotalUSD: number;
  taxAmountUSD: number;
  totalUSD: number;
  subtotalLocal: number;
  discountAmountLocal: number;
  taxableSubtotalLocal: number;
  exemptSubtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;
  totalCostUSD: number;
  grossProfitUSD: number;
  profitMarginPercent: number;
  itemsCount: number;
  totalUnits: number;
  functional: CurrencyBreakdownValues;
  local: CurrencyBreakdownValues;
}

export function useSaleCalculations(
  items: SaleItemFormData[] = [],
  exchangeRate: number = 1.0,
): SaleFinancialsBreakdown {
  return useMemo(() => {
    const rate = exchangeRate > 0 ? exchangeRate : 1.0;

    let subtotalUSD = 0;
    let discountAmountUSD = 0;
    let taxableSubtotalUSD = 0;
    let exemptSubtotalUSD = 0;
    let taxAmountUSD = 0;
    let totalCostUSD = 0;
    let totalUnits = 0;

    for (const item of items) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const cost = Number(item.unitCost) || 0;
      const discountRate = Math.max(0, Math.min(100, Number(item.discountRate) || 0));

      const lineGross = qty * price;
      const lineDiscount = (lineGross * discountRate) / 100;
      const lineNet = lineGross - lineDiscount;

      totalUnits += qty;
      subtotalUSD += lineGross;
      discountAmountUSD += lineDiscount;
      totalCostUSD += qty * cost;

      if (item.isTaxable !== false) {
        taxableSubtotalUSD += lineNet;
        const taxRate = Number(item.taxRate) >= 0 ? Number(item.taxRate) : 16.0;
        taxAmountUSD += (lineNet * taxRate) / 100;
      } else {
        exemptSubtotalUSD += lineNet;
      }
    }

    const totalUSD = taxableSubtotalUSD + exemptSubtotalUSD + taxAmountUSD;

    const subtotalLocal = subtotalUSD * rate;
    const discountAmountLocal = discountAmountUSD * rate;
    const taxableSubtotalLocal = taxableSubtotalUSD * rate;
    const exemptSubtotalLocal = exemptSubtotalUSD * rate;
    const taxAmountLocal = taxAmountUSD * rate;
    const totalLocal = totalUSD * rate;

    const netSalesUSD = taxableSubtotalUSD + exemptSubtotalUSD;
    const grossProfitUSD = netSalesUSD - totalCostUSD;
    const profitMarginPercent =
      netSalesUSD > 0
        ? Number(((grossProfitUSD / netSalesUSD) * 100).toFixed(2))
        : 0;

    const functional: CurrencyBreakdownValues = {
      subtotal: Number(subtotalUSD.toFixed(2)),
      discountAmount: Number(discountAmountUSD.toFixed(2)),
      taxableSubtotal: Number(taxableSubtotalUSD.toFixed(2)),
      exemptSubtotal: Number(exemptSubtotalUSD.toFixed(2)),
      taxAmount: Number(taxAmountUSD.toFixed(2)),
      total: Number(totalUSD.toFixed(2)),
    };

    const local: CurrencyBreakdownValues = {
      subtotal: Number(subtotalLocal.toFixed(2)),
      discountAmount: Number(discountAmountLocal.toFixed(2)),
      taxableSubtotal: Number(taxableSubtotalLocal.toFixed(2)),
      exemptSubtotal: Number(exemptSubtotalLocal.toFixed(2)),
      taxAmount: Number(taxAmountLocal.toFixed(2)),
      total: Number(totalLocal.toFixed(2)),
    };

    return {
      subtotalUSD: Number(subtotalUSD.toFixed(2)),
      discountAmountUSD: Number(discountAmountUSD.toFixed(2)),
      taxableSubtotalUSD: Number(taxableSubtotalUSD.toFixed(2)),
      exemptSubtotalUSD: Number(exemptSubtotalUSD.toFixed(2)),
      taxAmountUSD: Number(taxAmountUSD.toFixed(2)),
      totalUSD: Number(totalUSD.toFixed(2)),
      subtotalLocal: Number(subtotalLocal.toFixed(2)),
      discountAmountLocal: Number(discountAmountLocal.toFixed(2)),
      taxableSubtotalLocal: Number(taxableSubtotalLocal.toFixed(2)),
      exemptSubtotalLocal: Number(exemptSubtotalLocal.toFixed(2)),
      taxAmountLocal: Number(taxAmountLocal.toFixed(2)),
      totalLocal: Number(totalLocal.toFixed(2)),
      totalCostUSD: Number(totalCostUSD.toFixed(2)),
      grossProfitUSD: Number(grossProfitUSD.toFixed(2)),
      profitMarginPercent,
      itemsCount: items.length,
      totalUnits: Number(totalUnits.toFixed(2)),
      functional,
      local,
    };
  }, [items, exchangeRate]);
}
