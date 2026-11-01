import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseFormSchema, type PurchaseFormData } from '../../schemas/purchase.schema';
import type { Purchase } from '../../types';
import type { Product } from '@/features/catalog/products/types';
import { useCurrencyStore } from '@/shared/hooks/store';
import { usePurchaseFormItems } from './usePurchaseFormItems';
import { usePurchaseCalculations } from './usePurchaseCalculations';
import { buildPurchaseDefaultValues } from './purchaseFormDefaultValues';

export interface UsePurchaseFormProps {
  initialPurchase?: Purchase | null;
  rawMaterials: Product[];
}

export function usePurchaseForm({ initialPurchase, rawMaterials }: UsePurchaseFormProps) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const materialsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const m of rawMaterials) {
      map.set(m.id, m);
    }
    return map;
  }, [rawMaterials]);

  const defaultValues = useMemo<PurchaseFormData>(() => {
    return buildPurchaseDefaultValues({
      initialPurchase,
      functionalCurrency,
      functionalSymbol,
      localCurrency,
      localSymbol,
    });
  }, [initialPurchase, functionalCurrency, functionalSymbol, localCurrency, localSymbol]);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset, control, setValue, getValues } = form;

  useEffect(() => {
    if (initialPurchase) {
      reset(defaultValues);
    }
  }, [initialPurchase, defaultValues, reset]);

  const watchedRate = Number(useWatch({ control, name: 'exchangeRate' })) || 1.0;
  const watchedDocumentCurrency = useWatch({ control, name: 'documentCurrency' }) || functionalCurrency;
  const watchedLocalCurrency = useWatch({ control, name: 'localCurrency' }) || localCurrency;

  const formItems = usePurchaseFormItems({
    control,
    setValue,
    getValues,
    materialsMap,
    exchangeRate: watchedRate,
    documentCurrency: watchedDocumentCurrency,
    localCurrency: watchedLocalCurrency,
  });

  const watchedItems = useWatch({ control, name: 'items' }) || [];

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
