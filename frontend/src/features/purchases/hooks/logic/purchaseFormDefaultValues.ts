import type { PurchaseFormData } from '../../schemas/purchase.schema';
import type { Purchase } from '../../types';

export interface DefaultValuesParams {
  initialPurchase?: Purchase | null;
  functionalCurrency: string;
  functionalSymbol: string;
  localCurrency: string;
  localSymbol: string;
}

export function getTodayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function buildPurchaseDefaultValues({
  initialPurchase,
  functionalCurrency,
  functionalSymbol,
  localCurrency,
  localSymbol,
}: DefaultValuesParams): PurchaseFormData {
  if (initialPurchase) {
    const formFunctionalCurrency = initialPurchase.functionalCurrency || functionalCurrency;
    const formLocalCurrency = initialPurchase.localCurrency || localCurrency;
    const docCurrency = initialPurchase.documentCurrency || formFunctionalCurrency;
    const rate = Number(initialPurchase.exchangeRate) || 1.0;
    const isDocLocal = docCurrency === formLocalCurrency;

    return {
      purchaseNumber: initialPurchase.purchaseNumber || '',
      supplierName: initialPurchase.supplierName || '',
      purchaseDate: initialPurchase.purchaseDate
        ? new Date(initialPurchase.purchaseDate).toISOString().split('T')[0]
        : getTodayIsoDate(),
      invoiceNumber: initialPurchase.invoiceNumber || '',
      exchangeRate: rate,
      functionalCurrency: formFunctionalCurrency,
      localCurrency: formLocalCurrency,
      documentCurrency: docCurrency,
      description: initialPurchase.description || '',
      status: initialPurchase.status || 'DRAFT',
      items: (initialPurchase.items || []).map((item, index) => {
        const costFunctional = Number(item.unitCost) || 0;
        const costLocal = Number(item.unitCostLocal) || Number((costFunctional * rate).toFixed(4));
        const inputCost = isDocLocal ? costLocal : costFunctional;
        const qty = Number(item.quantity) || 1;
        const subtotal = Number((qty * inputCost).toFixed(2));

        return {
          id: item.id,
          materialId: item.materialId,
          description: item.description || '',
          quantity: qty,
          unitCost: inputCost,
          unitCostLocal: costLocal,
          subtotal,
          lastEditedField: 'unitCost',
          currencySymbolFunctional: item.currencySymbolFunctional || functionalSymbol,
          currencySymbolLocal: item.currencySymbolLocal || localSymbol,
          isTaxable: item.isTaxable !== undefined ? item.isTaxable : true,
          taxRate: item.taxRate !== undefined ? Number(item.taxRate) : 16.0,
          sortOrder: item.sortOrder !== undefined ? item.sortOrder : index,
        };
      }),
    };
  }

  return {
    purchaseNumber: '',
    supplierName: '',
    purchaseDate: getTodayIsoDate(),
    invoiceNumber: '',
    exchangeRate: 1.0,
    functionalCurrency,
    localCurrency,
    documentCurrency: functionalCurrency,
    description: '',
    status: 'DRAFT',
    items: [],
  };
}

