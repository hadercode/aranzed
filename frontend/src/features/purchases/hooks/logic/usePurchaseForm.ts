import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  purchaseFormSchema,
  type PurchaseFormData,
} from '../../schemas/purchase.schema';
import type { Purchase } from '../../types';
import type { Product } from '@/features/catalog/products/types';
import { useCurrencyStore } from '@/shared/hooks/store';
import { usePurchaseFormItems } from './usePurchaseFormItems';
import { usePurchaseCalculations } from './usePurchaseCalculations';

export interface UsePurchaseFormProps {
  initialPurchase?: Purchase | null;
  rawMaterials: Product[];
}

function getTodayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function usePurchaseForm({
  initialPurchase,
  rawMaterials,
}: UsePurchaseFormProps) {
  const {
    functionalCurrency,
    functionalSymbol,
    localCurrency,
    localSymbol,
  } = useCurrencyStore();

  const materialsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const m of rawMaterials) {
      map.set(m.id, m);
    }
    return map;
  }, [rawMaterials]);

  const defaultValues = useMemo<PurchaseFormData>(() => {
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
  }, [initialPurchase, functionalCurrency, functionalSymbol, localCurrency, localSymbol]);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset, control, setValue, getValues } = form;

  // Sincronizar cuando cargue un registro existente
  useEffect(() => {
    if (initialPurchase) {
      reset(defaultValues);
    }
  }, [initialPurchase, defaultValues, reset]);

  // Escuchar tasa de cambio y monedas reactivamente
  const watchedRate = Number(useWatch({ control, name: 'exchangeRate' })) || 1.0;
  const watchedDocumentCurrency = useWatch({ control, name: 'documentCurrency' }) || functionalCurrency;
  const watchedLocalCurrency = useWatch({ control, name: 'localCurrency' }) || localCurrency;

  // Sub-hook para manejo de renglones dinámicos
  const formItems = usePurchaseFormItems({
    control,
    setValue,
    getValues,
    materialsMap,
    exchangeRate: watchedRate,
    documentCurrency: watchedDocumentCurrency,
    localCurrency: watchedLocalCurrency,
  });

  // Escuchar renglones reactivamente para cálculo matemático
  const watchedItems = useWatch({
    control,
    name: 'items',
  }) || [];

  const { breakdown } = usePurchaseCalculations({
    items: watchedItems,
    exchangeRate: watchedRate,
    documentCurrency: watchedDocumentCurrency,
    localCurrency: watchedLocalCurrency,
  });

  return {
    form,
    formItems,
    breakdown,
    materialsMap,
    exchangeRate: watchedRate,
    documentCurrency: watchedDocumentCurrency,
  };
}

export type UsePurchaseFormReturn = ReturnType<typeof usePurchaseForm>;
