import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { UpdateInventoryTransactionDto } from '@/inventory/transactions/presentation/http/dto/requests/update-inventory-transaction.dto';

export class UpdateInventoryTransactionCommand {
  id: string;
  notes?: string;
  movementDate?: string;
  status?: InventoryTransactionStatus;
  userId?: string;

  constructor(partial: Partial<UpdateInventoryTransactionCommand>) {
    Object.assign(this, partial);
  }

  static fromDto(
    id: string,
    dto: UpdateInventoryTransactionDto,
    userId?: string,
  ): UpdateInventoryTransactionCommand {
    return new UpdateInventoryTransactionCommand({
      id,
      notes: dto.notes,
      movementDate: dto.movementDate,
      status: dto.status,
      userId,
    });
  }
}
