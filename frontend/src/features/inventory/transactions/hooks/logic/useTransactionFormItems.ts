import { useState, useCallback } from 'react';

export interface TransactionFormItem {
  id?: string;
  productId: string;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost: number;
  secQuantity?: number;
  secUomSymbol?: string;
  batchNumber?: string;
  expiryDate?: string;
  customComment?: string;
}

export const createDefaultTransactionItem = (): TransactionFormItem => ({
  productId: '',
  skuSnapshot: '',
  nameSnapshot: '',
  uomSymbol: 'UN',
  quantity: 1,
  cost: 0,
  batchNumber: '',
});

export function useTransactionFormItems(products: any[] = []) {
  const [items, setItems] = useState<TransactionFormItem[]>([
    createDefaultTransactionItem(),
  ]);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createDefaultTransactionItem()]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateItem = useCallback((index: number, patch: Partial<TransactionFormItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const selectProduct = useCallback(
    (index: number, productId: string) => {
      const prod = products.find((p) => p.id === productId);
      if (!prod) return;

      setItems((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          productId: prod.id,
          skuSnapshot: prod.sku || prod.name.slice(0, 6).toUpperCase(),
          nameSnapshot: prod.name,
          uomSymbol: prod.uom?.symbol || prod.uomSymbol || 'UN',
          cost: Number(prod.costPrice || prod.cost || 0),
        };
        return next;
      });
    },
    [products]
  );

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    selectProduct,
  };
}

export default useTransactionFormItems;
