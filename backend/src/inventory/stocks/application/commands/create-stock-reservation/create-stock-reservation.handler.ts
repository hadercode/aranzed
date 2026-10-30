import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateStockReservationCommand } from './create-stock-reservation.command';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';
import { StockReservationOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/stock-reservation.orm-entity';

@CommandHandler(CreateStockReservationCommand)
export class CreateStockReservationHandler
  implements ICommandHandler<CreateStockReservationCommand>
{
  constructor(private readonly stocksService: InventoryStocksService) {}

  async execute(
    command: CreateStockReservationCommand,
  ): Promise<StockReservationOrmEntity> {
    return this.stocksService.createReservation(
      {
        stockId: command.stockId,
        referenceType: command.referenceType,
        referenceId: command.referenceId,
        referenceItemId: command.referenceItemId,
        reservedQty: command.reservedQty,
        secReservedQty: command.secReservedQty,
      },
      command.userId,
    );
  }
}

