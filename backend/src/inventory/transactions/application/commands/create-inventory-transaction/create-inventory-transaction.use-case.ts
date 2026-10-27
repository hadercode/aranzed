import { Injectable, Inject } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import {
  INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
  type IInventoryTransactionRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionCompletedEvent } from '@/inventory/transactions/domain/events/inventory-transaction-completed.event';
import {
  InventoryTransactionCommandMapper,
  InventoryTransactionItemCommandMapper,
} from '@/inventory/transactions/application/mappers';
import { InventoryTransactionsValidationService } from '@/inventory/transactions/application/services/inventory-transactions-validation.service';
import { InventoryStockExecutionService } from '@/inventory/transactions/application/services/inventory-stock-execution.service';
import { CreateInventoryTransactionCommand } from './create-inventory-transaction.command';

@Injectable()
export class CreateInventoryTransactionUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY_TOKEN)
    private readonly repository: IInventoryTransactionRepository,
    private readonly validationService: InventoryTransactionsValidationService,
    private readonly stockExecutionService: InventoryStockExecutionService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateInventoryTransactionCommand,
  ): Promise<InventoryTransaction> {
    // 1. Validaciones contextuales de negocio (almacenes, motivos en DB)
    await this.validationService.validateMovementContext({
      type: command.type,
      reasonId: command.reasonId,
      originWarehouseId: command.originWarehouseId,
      destWarehouseId: command.destWarehouseId,
    });

    // 2. Resolver número correlativo de transacción
    const transactionNumber =
      command.transactionNumber ||
      (await this.repository.generateTransactionNumber());

    const transactionId = randomUUID();

    // 3. Mapear renglones a entidades de dominio
    const items = InventoryTransactionItemCommandMapper.toDomainList(
      command.items.map((item) => ({
        ...item,
        id: randomUUID(),
        createdById: command.createdById,
      })),
      transactionId,
    );

    // 4. Instanciar agregado de dominio
    const transaction = InventoryTransactionCommandMapper.toDomain(
      {
        ...command,
        id: transactionId,
        transactionNumber,
        status: command.status || InventoryTransactionStatus.DRAFT,
      },
      items,
    );

    // 5. Validar invariantes del modelo de dominio
    transaction.validate();

    // 6. Persistir de forma atómica en el repositorio
    const saved = await this.repository.save(transaction);

    // 7. Si se crea en estado COMPLETED, procesar stock FIFO y Kárdex
    if (saved.status === InventoryTransactionStatus.COMPLETED) {
      await this.stockExecutionService.processStockMovement(
        saved,
        command.createdById,
      );

      this.eventBus.publish(
        new InventoryTransactionCompletedEvent(
          saved.id,
          saved.transactionNumber,
          saved.type,
          saved.movementDate,
          saved.originWarehouseId,
          saved.destWarehouseId,
          saved.referenceEntityType,
          saved.referenceEntityId,
          saved.items.length,
          command.createdById,
        ),
      );
    }

    // Refrescar entidad post-procesamiento si fue completada
    return (await this.repository.findById(saved.id)) || saved;
  }
}
