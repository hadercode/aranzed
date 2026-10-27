import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saleFormSchema, type SaleFormData } from '../../schemas/sale.schema';
import type { Sale } from '../../types';
import type { Product } from '@/features/catalog/products/types';
import { useCurrencyStore } from '@/shared/hooks/store';
import { useSaleFormItems } from './useSaleFormItems';
import { useSaleCalculations } from './useSaleCalculations';

export interface UseSaleFormProps {
  initialSale?: Sale | null;
  availableProducts?: Product[];
}

function getTodayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function useSaleForm({
  initialSale,
  availableProducts = [],
}: UseSaleFormProps) {
  const { functionalCurrency, localCurrency } = useCurrencyStore();

  const defaultValues = useMemo<SaleFormData>(() => {
    if (initialSale) {
      return {
        saleNumber: initialSale.saleNumber || '',
        saleType: initialSale.saleType || 'DIRECT_SALE',
        paymentTerm: initialSale.paymentTerm || 'CONTADO',
        dueDate: initialSale.dueDate
          ? new Date(initialSale.dueDate).toISOString().split('T')[0]
          : '',
        paidStatus: initialSale.paidStatus || 'PENDIENTE',
        status: initialSale.status || 'DRAFT',
        customerName: initialSale.customerName || 'Consumidor Final',
        customerTaxId: initialSale.customerTaxId || '',
        customerEmail: initialSale.customerEmail || '',
        customerPhone: initialSale.customerPhone || '',
        customerAddress: initialSale.customerAddress || '',
        notes: initialSale.notes || '',
        paymentMethod: initialSale.paymentMethod || 'CASH',
        paymentNotes: initialSale.paymentNotes || '',
        saleDate: initialSale.saleDate
          ? new Date(initialSale.saleDate).toISOString().split('T')[0]
          : getTodayIsoDate(),
        validUntil: initialSale.validUntil
          ? new Date(initialSale.validUntil).toISOString().split('T')[0]
          : null,
        exchangeRate: Number(initialSale.exchangeRate) || 1.0,
        functionalCurrency: initialSale.functionalCurrency || functionalCurrency || 'USD',
        localCurrency: initialSale.localCurrency || localCurrency || 'VES',
        documentCurrency: initialSale.documentCurrency || 'USD',
        items: (initialSale.items || []).map((it, idx) => ({
          id: it.id,
          productId: it.productId,
          description: it.description || '',
          productType: it.productType || 'TRADITIONAL',
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          unitCost: Number(it.unitCost) || 0,
          discountRate: Number(it.discountRate) || 0,
          isTaxable: it.isTaxable !== undefined ? Boolean(it.isTaxable) : true,
          taxRate: Number(it.taxRate) >= 0 ? Number(it.taxRate) : 16.0,
          sortOrder: it.sortOrder !== undefined ? it.sortOrder : idx,
          unitPriceLocal: Number(it.unitPriceLocal) || 0,
          subtotalLocal: Number(it.subtotalLocal) || 0,
          totalLocal: Number(it.totalLocal) || 0,
        })),
      };
    }

    return {
      saleNumber: '',
      saleType: 'DIRECT_SALE',
      paymentTerm: 'CONTADO',
      dueDate: '',
      paidStatus: 'PENDIENTE',
      status: 'DRAFT',
      customerName: 'Consumidor Final',
      customerTaxId: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      notes: '',
      paymentMethod: 'CASH',
      paymentNotes: '',
      saleDate: getTodayIsoDate(),
      validUntil: null,
      exchangeRate: 1.0,
      functionalCurrency: functionalCurrency || 'USD',
      localCurrency: localCurrency || 'VES',
      documentCurrency: 'USD',
      items: [],
    };
  }, [initialSale, functionalCurrency, localCurrency]);

  const formMethods = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { control, setValue, reset } = formMethods;

  // Sincronizar únicamente cuando se carga un comprobante existente
  useEffect(() => {
    if (initialSale) {
      reset(defaultValues);
    }
  }, [initialSale, defaultValues, reset]);

  // Observar tasa de cambio reactivamente
  const watchedRate = Number(useWatch({ control, name: 'exchangeRate' })) || 1.0;
  const watchedItems = useWatch({ control, name: 'items' }) || [];

  // Gestión de líneas dinámicas
  const formItems = useSaleFormItems({
    control,
    setValue,
    products: availableProducts,
    exchangeRate: watchedRate,
  });

  // Cálculos financieros reactivos
  const financials = useSaleCalculations(watchedItems, watchedRate);

  return {
    ...formMethods,
    ...formItems,
    financials,
    watchedRate,
    watchedItems,
  };
}

export type UseSaleFormReturn = ReturnType<typeof useSaleForm>;
