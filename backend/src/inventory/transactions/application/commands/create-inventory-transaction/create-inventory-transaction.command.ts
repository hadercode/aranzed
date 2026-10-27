import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { CreateInventoryTransactionDto } from '@/inventory/transactions/presentation/http/dto/requests/create-inventory-transaction.dto';

export interface CreateInventoryTransactionItemCommandInput {
  productId: string;
  variantId?: string;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost?: number;
  secQuantity?: number;
  secUomSymbol?: string;
  batchNumber?: string;
  expiryDate?: string;
  customComment?: string;
}

export class CreateInventoryTransactionCommand {
  transactionNumber?: string;
  type: InventoryTransactionType;
  reasonId?: string;
  originWarehouseId?: string;
  destWarehouseId?: string;
  status?: InventoryTransactionStatus;
  movementDate?: string;
  referenceEntityType?: string;
  referenceEntityId?: string;
  notes?: string;
  documents?: string[];
  items: CreateInventoryTransactionItemCommandInput[];
  createdById?: string;

  constructor(partial: Partial<CreateInventoryTransactionCommand>) {
    Object.assign(this, partial);
    this.items = partial.items || [];
  }

  static fromDto(
    dto: CreateInventoryTransactionDto,
    createdById?: string,
  ): CreateInventoryTransactionCommand {
    return new CreateInventoryTransactionCommand({
      ...dto,
      createdById,
    });
  }
}
