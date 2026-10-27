import { Injectable } from '@nestjs/common';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import {
  FindInventoryTransactionsFilters,
  PaginatedTransactionsQueryResult,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { CreateInventoryTransactionDto } from '@/inventory/transactions/presentation/http/dto/requests/create-inventory-transaction.dto';
import { UpdateInventoryTransactionDto } from '@/inventory/transactions/presentation/http/dto/requests/update-inventory-transaction.dto';
import { CreateInventoryTransactionUseCase } from '../commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { CreateInventoryTransactionCommand } from '../commands/create-inventory-transaction/create-inventory-transaction.command';
import { UpdateInventoryTransactionUseCase } from '../commands/update-inventory-transaction/update-inventory-transaction.use-case';
import { UpdateInventoryTransactionCommand } from '../commands/update-inventory-transaction/update-inventory-transaction.command';
import { DeleteInventoryTransactionUseCase } from '../commands/delete-inventory-transaction/delete-inventory-transaction.use-case';
import { DeleteInventoryTransactionCommand } from '../commands/delete-inventory-transaction/delete-inventory-transaction.command';
import { FindInventoryTransactionsUseCase } from '../queries/find-inventory-transactions/find-inventory-transactions.use-case';
import { FindInventoryTransactionsQuery } from '../queries/find-inventory-transactions/find-inventory-transactions.query';
import { FindInventoryTransactionByIdUseCase } from '../queries/find-inventory-transaction-by-id/find-inventory-transaction-by-id.use-case';
import { FindInventoryTransactionByIdQuery } from '../queries/find-inventory-transaction-by-id/find-inventory-transaction-by-id.query';

@Injectable()
export class InventoryTransactionsService {
  constructor(
    private readonly createUseCase: CreateInventoryTransactionUseCase,
    private readonly updateUseCase: UpdateInventoryTransactionUseCase,
    private readonly deleteUseCase: DeleteInventoryTransactionUseCase,
    private readonly findTransactionsUseCase: FindInventoryTransactionsUseCase,
    private readonly findByIdUseCase: FindInventoryTransactionByIdUseCase,
  ) {}

  async findAll(
    filters?: FindInventoryTransactionsFilters,
  ): Promise<PaginatedTransactionsQueryResult> {
    return this.findTransactionsUseCase.execute(
      new FindInventoryTransactionsQuery(filters),
    );
  }

  async findOne(id: string): Promise<InventoryTransaction> {
    return this.findByIdUseCase.execute(
      new FindInventoryTransactionByIdQuery(id),
    );
  }

  async create(
    dto: CreateInventoryTransactionDto,
    userId?: string,
  ): Promise<InventoryTransaction> {
    const command = CreateInventoryTransactionCommand.fromDto(dto, userId);
    return this.createUseCase.execute(command);
  }

  async update(
    id: string,
    dto: UpdateInventoryTransactionDto,
    userId?: string,
  ): Promise<InventoryTransaction> {
    const command = UpdateInventoryTransactionCommand.fromDto(id, dto, userId);
    return this.updateUseCase.execute(command);
  }

  async remove(id: string): Promise<void> {
    return this.deleteUseCase.execute(
      new DeleteInventoryTransactionCommand(id),
    );
  }
}
