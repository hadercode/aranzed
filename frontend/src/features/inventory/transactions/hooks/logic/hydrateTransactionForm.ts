import type { InventoryTransaction } from '../../types';
import type { TransactionFormItem } from './useTransactionFormItems';

export function mapTransactionItemsToForm(
  items?: InventoryTransaction['items']
): TransactionFormItem[] {
  if (!items || items.length === 0) return [];
  return items.map((it) => ({
    id: it.id,
    productId: it.productId,
    skuSnapshot: it.skuSnapshot,
    nameSnapshot: it.nameSnapshot,
    uomSymbol: it.uomSymbol,
    quantity: Number(it.quantity),
    cost: Number(it.cost || 0),
    secQuantity: it.secQuantity ? Number(it.secQuantity) : undefined,
    secUomSymbol: it.secUomSymbol || undefined,
    batchNumber: it.batchNumber || '',
    expiryDate: it.expiryDate ? it.expiryDate.slice(0, 10) : '',
    customComment: it.customComment || '',
  }));
}

