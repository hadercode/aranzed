import { InventoryTransactionType } from '../enums/inventory-transaction-type.enum';

export class InventoryTransactionCompletedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly transactionNumber: string,
    public readonly type: InventoryTransactionType,
    public readonly movementDate: Date,
    public readonly originWarehouseId?: string | null,
    public readonly destWarehouseId?: string | null,
    public readonly referenceEntityType?: string | null,
    public readonly referenceEntityId?: string | null,
    public readonly itemCount: number = 0,
    public readonly userId?: string | null,
  ) {}
}
