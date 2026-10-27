import { useCallback, useMemo } from 'react';
import { useFieldArray, type Control, type UseFormSetValue } from 'react-hook-form';
import type { SaleFormData } from '../../schemas/sale.schema';
import type { Product } from '@/features/catalog/products/types';

export interface UseSaleFormItemsProps {
  control: Control<SaleFormData>;
  setValue: UseFormSetValue<SaleFormData>;
  products?: Product[];
  exchangeRate?: number;
}

/**
 * Hook modular para la gestión del detalle de líneas de venta (Header-Detail pattern).
 * Maneja useFieldArray con IDs estables, autocompletado reactivo de precios y costos
 * al seleccionar un producto del catálogo, y cálculos de conversión de moneda en tiempo real.
 */
export function useSaleFormItems({
  control,
  setValue,
  products = [],
  exchangeRate = 1.0,
}: UseSaleFormItemsProps) {
  const {
    fields: itemsFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'items',
  });

  // Mapa indexado por ID para búsqueda rápida O(1) de productos
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  // Agregar una fila en blanco o preseleccionada con valores por defecto válidos
  const handleAddNewItem = useCallback(
    (defaultProductId?: string) => {
      let description = '';
      let productType = 'TRADITIONAL';
      let unitPrice = 0;
      let unitCost = 0;
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (defaultProductId) {
        const selected = productsMap.get(defaultProductId);
        if (selected) {
          description = selected.name;
          productType = selected.type;
          unitPrice = Number(selected.lastSalePrice || 0);
          unitCost = Number(selected.lastCost || 0);
        }
      }

      append({
        productId: defaultProductId || '',
        description,
        productType,
        quantity: 1,
        unitPrice,
        unitCost,
        discountRate: 0,
        isTaxable: true,
        taxRate: 16.0,
        sortOrder: itemsFields.length,
        unitPriceLocal: Number((unitPrice * rate).toFixed(2)),
        subtotalLocal: Number((unitPrice * rate).toFixed(2)),
        totalLocal: Number((unitPrice * 1.16 * rate).toFixed(2)),
      });
    },
    [append, itemsFields.length, productsMap, exchangeRate],
  );

  // Al seleccionar un producto del catálogo: autocompletar nombre, tipo, precio y costo
  const handleProductSelect = useCallback(
    (index: number, productId: string) => {
      const selected = productsMap.get(productId);
      if (!selected) {
        setValue(`items.${index}.productId`, '', { shouldValidate: true, shouldDirty: true });
        setValue(`items.${index}.description`, '', { shouldValidate: true, shouldDirty: true });
        return;
      }

      const rate = exchangeRate > 0 ? exchangeRate : 1.0;
      const unitPrice = Number(selected.lastSalePrice || 0);
      const unitCost = Number(selected.lastCost || 0);

      setValue(`items.${index}.productId`, selected.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.description`, selected.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.productType`, selected.type, {
        shouldDirty: true,
      });
      setValue(`items.${index}.unitPrice`, unitPrice, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.unitCost`, unitCost, {
        shouldDirty: true,
      });
      setValue(
        `items.${index}.unitPriceLocal`,
        Number((unitPrice * rate).toFixed(2)),
        { shouldDirty: true },
      );
    },
    [setValue, productsMap, exchangeRate],
  );

  // Alternar si la línea aplica IVA (16%) o está exenta (0%)
  const handleToggleTaxable = useCallback(
    (index: number, isTaxable: boolean) => {
      setValue(`items.${index}.isTaxable`, isTaxable, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.taxRate`, isTaxable ? 16.0 : 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  return {
    itemsFields,
    appendItem: handleAddNewItem,
    removeItem: remove,
    updateItem: update,
    handleProductSelect,
    handleToggleTaxable,
    productsMap,
  };
}

export type UseSaleFormItemsReturn = ReturnType<typeof useSaleFormItems>;
