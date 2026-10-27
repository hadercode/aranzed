import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionItem } from '@/inventory/transactions/domain/entities/inventory-transaction-item.entity';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';

export interface InventoryTransactionCommandPayload {
  id?: string;
  transactionNumber?: string;
  type: InventoryTransactionType;
  reasonId?: string | null;
  originWarehouseId?: string | null;
  destWarehouseId?: string | null;
  status?: InventoryTransactionStatus;
  movementDate?: Date | string;
  referenceEntityType?: string | null;
  referenceEntityId?: string | null;
  notes?: string | null;
  documents?: string[] | null;
  createdById?: string | null;
}

export class InventoryTransactionCommandMapper {
  static toDomain(
    payload: InventoryTransactionCommandPayload,
    items: InventoryTransactionItem[] = [],
  ): InventoryTransaction {
    const transaction = new InventoryTransaction({
      id: payload.id,
      transactionNumber: payload.transactionNumber?.trim(),
      type: payload.type,
      reasonId: payload.reasonId || null,
      originWarehouseId: payload.originWarehouseId || null,
      destWarehouseId: payload.destWarehouseId || null,
      status: payload.status || InventoryTransactionStatus.DRAFT,
      movementDate: payload.movementDate
        ? payload.movementDate instanceof Date
          ? payload.movementDate
          : new Date(payload.movementDate)
        : new Date(),
      referenceEntityType: payload.referenceEntityType?.trim() || null,
      referenceEntityId: payload.referenceEntityId || null,
      notes: payload.notes?.trim() || null,
      documents: payload.documents || null,
      createdById: payload.createdById || null,
      items,
    });

    return transaction;
  }
}
