import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryReasonOrmEntity } from '@/inventory/reasons/infrastructure/persistence/typeorm/entities/inventory-reason.orm-entity';
import { InventoryReasonType } from '@/inventory/reasons/domain/enums/inventory-reason-type.enum';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';

export interface ValidateTransactionContext {
  type: InventoryTransactionType;
  reasonId?: string | null;
  originWarehouseId?: string | null;
  destWarehouseId?: string | null;
}

@Injectable()
export class InventoryTransactionsValidationService {
  constructor(
    @InjectRepository(InventoryReasonOrmEntity)
    private readonly reasonRepo: Repository<InventoryReasonOrmEntity>,
  ) {}

  async validateMovementContext(
    context: ValidateTransactionContext,
  ): Promise<void> {
    if (context.type === InventoryTransactionType.ADJUSTMENT) {
      if (!context.reasonId) {
        throw new BadRequestException(
          'El motivo de inventario es requerido para transacciones de ajuste',
        );
      }

      const reason = await this.reasonRepo.findOne({
        where: { id: context.reasonId },
      });

      if (!reason) {
        throw new BadRequestException(
          'El motivo de inventario especificado no existe',
        );
      }

      if (reason.type === InventoryReasonType.INPUT) {
        if (!context.destWarehouseId) {
          throw new BadRequestException(
            'Para un ajuste positivo (INPUT), el almacén de destino es requerido',
          );
        }
        if (context.originWarehouseId) {
          throw new BadRequestException(
            'Para un ajuste positivo (INPUT), el almacén origen debe estar vacío',
          );
        }
      } else if (reason.type === InventoryReasonType.OUTPUT) {
        if (!context.originWarehouseId) {
          throw new BadRequestException(
            'Para un ajuste negativo (OUTPUT), el almacén de origen es requerido',
          );
        }
        if (context.destWarehouseId) {
          throw new BadRequestException(
            'Para un ajuste negativo (OUTPUT), el almacén destino debe estar vacío',
          );
        }
      }
    }
  }
}
