import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import {
  INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
  type IInventoryTransactionRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionCompletedEvent } from '@/inventory/transactions/domain/events/inventory-transaction-completed.event';
import { InventoryTransactionCancelledEvent } from '@/inventory/transactions/domain/events/inventory-transaction-cancelled.event';
import { InventoryStockExecutionService } from '@/inventory/transactions/application/services/inventory-stock-execution.service';
import { UpdateInventoryTransactionCommand } from './update-inventory-transaction.command';

@Injectable()
export class UpdateInventoryTransactionUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY_TOKEN)
    private readonly repository: IInventoryTransactionRepository,
    private readonly stockExecutionService: InventoryStockExecutionService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: UpdateInventoryTransactionCommand,
  ): Promise<InventoryTransaction> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        `Transacción con ID ${command.id} no encontrada`,
      );
    }

    // Regla de Negocio: Transacciones ya completadas no pueden alterarse excepto para cancelación
    if (
      existing.status === InventoryTransactionStatus.COMPLETED &&
      command.status !== InventoryTransactionStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'No se puede modificar una transacción ya completada',
      );
    }

    // Flujo de anulación / cancelación de una transacción completada
    if (
      command.status === InventoryTransactionStatus.CANCELLED &&
      existing.status === InventoryTransactionStatus.COMPLETED
    ) {
      await this.stockExecutionService.revertStockMovement(existing);
      existing.transitionTo(InventoryTransactionStatus.CANCELLED);
      const saved = await this.repository.save(existing);

      this.eventBus.publish(
        new InventoryTransactionCancelledEvent(
          saved.id,
          saved.transactionNumber,
          command.userId,
        ),
      );

      return (await this.repository.findById(saved.id)) || saved;
    }

    // Modificación de campos en borrador / tránsito
    if (command.notes !== undefined) existing.notes = command.notes;
    if (command.movementDate) {
      existing.movementDate = new Date(command.movementDate);
    }

    // Transición de estado
    if (command.status && command.status !== existing.status) {
      existing.transitionTo(command.status);

      if (command.status === InventoryTransactionStatus.COMPLETED) {
        // Persistir antes de ejecutar para asegurar IDs
        const saved = await this.repository.save(existing);
        await this.stockExecutionService.processStockMovement(
          saved,
          command.userId,
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
            command.userId,
          ),
        );

        return (await this.repository.findById(saved.id)) || saved;
      }
    }

    const updated = await this.repository.save(existing);
    return (await this.repository.findById(updated.id)) || updated;
  }
}
