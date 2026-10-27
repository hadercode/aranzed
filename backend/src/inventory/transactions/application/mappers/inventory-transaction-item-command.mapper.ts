import { InventoryTransactionItem } from '@/inventory/transactions/domain/entities/inventory-transaction-item.entity';

export interface InventoryTransactionItemCommandPayload {
  id?: string;
  transactionId?: string;
  productId: string;
  variantId?: string | null;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost?: number | null;
  secQuantity?: number | null;
  secUomSymbol?: string | null;
  batchNumber?: string | null;
  expiryDate?: Date | string | null;
  customComment?: string | null;
  createdById?: string | null;
}

export class InventoryTransactionItemCommandMapper {
  static toDomain(
    payload: InventoryTransactionItemCommandPayload,
    transactionId?: string,
  ): InventoryTransactionItem {
    return new InventoryTransactionItem({
      id: payload.id,
      transactionId: transactionId || payload.transactionId,
      productId: payload.productId,
      variantId: payload.variantId || null,
      skuSnapshot: payload.skuSnapshot?.trim(),
      nameSnapshot: payload.nameSnapshot?.trim(),
      uomSymbol: payload.uomSymbol?.trim(),
      quantity: Number(payload.quantity) || 0,
      cost:
        payload.cost !== undefined && payload.cost !== null
          ? Number(payload.cost)
          : null,
      secQuantity:
        payload.secQuantity !== undefined && payload.secQuantity !== null
          ? Number(payload.secQuantity)
          : null,
      secUomSymbol: payload.secUomSymbol?.trim() || null,
      batchNumber: payload.batchNumber?.trim() || null,
      expiryDate: payload.expiryDate
        ? payload.expiryDate instanceof Date
          ? payload.expiryDate
          : new Date(payload.expiryDate)
        : null,
      customComment: payload.customComment?.trim() || null,
      createdById: payload.createdById || null,
    });
  }

  static toDomainList(
    payloads: InventoryTransactionItemCommandPayload[] = [],
    transactionId?: string,
  ): InventoryTransactionItem[] {
    return payloads.map((payload) => this.toDomain(payload, transactionId));
  }
}
