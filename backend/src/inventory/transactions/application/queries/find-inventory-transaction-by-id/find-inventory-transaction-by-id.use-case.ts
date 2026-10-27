import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import {
  INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
  type IInventoryTransactionReadRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { FindInventoryTransactionByIdQuery } from './find-inventory-transaction-by-id.query';

@Injectable()
export class FindInventoryTransactionByIdUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN)
    private readonly repository: IInventoryTransactionReadRepository,
  ) {}

  async execute(
    query: FindInventoryTransactionByIdQuery,
  ): Promise<InventoryTransaction> {
    const transaction = await this.repository.findById(query.id);
    if (!transaction) {
      throw new NotFoundException(
        `Transacción de inventario con ID ${query.id} no encontrada`,
      );
    }
    return transaction;
  }
}
