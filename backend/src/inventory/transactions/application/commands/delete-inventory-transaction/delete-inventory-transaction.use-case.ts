import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
  type IInventoryTransactionRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { InventoryStockExecutionService } from '@/inventory/transactions/application/services/inventory-stock-execution.service';
import { DeleteInventoryTransactionCommand } from './delete-inventory-transaction.command';

@Injectable()
export class DeleteInventoryTransactionUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY_TOKEN)
    private readonly repository: IInventoryTransactionRepository,
    private readonly stockExecutionService: InventoryStockExecutionService,
  ) {}

  async execute(command: DeleteInventoryTransactionCommand): Promise<void> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        `Transacción con ID ${command.id} no encontrada`,
      );
    }

    if (existing.status === InventoryTransactionStatus.COMPLETED) {
      await this.stockExecutionService.revertStockMovement(existing);
    }

    await this.repository.delete(command.id);
  }
}
