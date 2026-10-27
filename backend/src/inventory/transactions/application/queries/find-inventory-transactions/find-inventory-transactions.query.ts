import { FindInventoryTransactionsFilters } from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';

export class FindInventoryTransactionsQuery {
  constructor(public readonly filters?: FindInventoryTransactionsFilters) {}
}
