import { Injectable, Inject } from '@nestjs/common';
import {
  INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
  type IInventoryTransactionReadRepository,
  type PaginatedTransactionsQueryResult,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { FindInventoryTransactionsQuery } from './find-inventory-transactions.query';

@Injectable()
export class FindInventoryTransactionsUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN)
    private readonly repository: IInventoryTransactionReadRepository,
  ) {}

  async execute(
    query?: FindInventoryTransactionsQuery,
  ): Promise<PaginatedTransactionsQueryResult> {
    return this.repository.findAll(query?.filters);
  }
}
