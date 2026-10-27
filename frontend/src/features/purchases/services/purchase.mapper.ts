import type { PurchaseFormData } from '../schemas/purchase.schema';
import type { PurchaseStatus } from '../types';

export interface PurchaseCurrencyContext {
  storeFunctionalCurrency: string;
  storeLocalCurrency: string;
  storeFunctionalSymbol: string;
  storeLocalSymbol: string;
}

export interface PurchaseItemPayload {
  id?: string;
  materialId: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitCostLocal: number;
  currencySymbolFunctional: string;
  currencySymbolLocal: string;
  isTaxable: boolean;
  taxRate: number;
  sortOrder: number;
}

export interface PurchasePayload {
  purchaseNumber?: string;
  supplierName: string;
  purchaseDate: string;
  invoiceNumber: string;
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;
  description?: string;
  status: PurchaseStatus;
  items: PurchaseItemPayload[];
}

/**
 * Transforma los datos del formulario de UI (`PurchaseFormData`)
 * al payload que requiere el endpoint de compras de la API (`PurchasePayload`),
 * resolviendo normalizaciones de texto, fechas ISO y conversiones bimonetarias.
 */
export function toPurchasePayload(
  data: PurchaseFormData,
  currencies: PurchaseCurrencyContext
): PurchasePayload {
  const rate = Number(data.exchangeRate) || 1.0;
  const functionalCurrency = data.functionalCurrency || currencies.storeFunctionalCurrency;
  const localCurrency = data.localCurrency || currencies.storeLocalCurrency;
  const documentCurrency = data.documentCurrency || functionalCurrency;
  const isDocLocal = documentCurrency === localCurrency;

  return {
    purchaseNumber: data.purchaseNumber?.trim() || undefined,
    supplierName: data.supplierName.trim(),
    purchaseDate: new Date(data.purchaseDate).toISOString(),
    invoiceNumber: data.invoiceNumber.trim(),
    exchangeRate: rate,
    functionalCurrency,
    localCurrency,
    documentCurrency,
    description: data.description?.trim() || undefined,
    status: data.status,
    items: data.items.map((item, index) => {
      const cost = Number(item.unitCost) || 0;
      const costFunctional = isDocLocal ? Number((cost / rate).toFixed(4)) : cost;
      const costLocal = isDocLocal ? cost : Number((cost * rate).toFixed(4));

      return {
        id: item.id,
        materialId: item.materialId,
        description: item.description.trim(),
        quantity: Number(item.quantity),
        unitCost: costFunctional,
        unitCostLocal: costLocal,
        currencySymbolFunctional: item.currencySymbolFunctional || currencies.storeFunctionalSymbol,
        currencySymbolLocal: item.currencySymbolLocal || currencies.storeLocalSymbol,
        isTaxable: item.isTaxable !== false,
        taxRate: item.isTaxable !== false ? Number(item.taxRate) || 16.0 : 0,
        sortOrder: index,
      };
    }),
  };
}
