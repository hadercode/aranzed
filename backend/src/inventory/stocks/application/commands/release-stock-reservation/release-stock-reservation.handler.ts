import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ReleaseStockReservationCommand } from './release-stock-reservation.command';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';

@CommandHandler(ReleaseStockReservationCommand)
export class ReleaseStockReservationHandler
  implements ICommandHandler<ReleaseStockReservationCommand>
{
  constructor(private readonly stocksService: InventoryStocksService) {}

  async execute(command: ReleaseStockReservationCommand): Promise<void> {
    return this.stocksService.releaseReservation(command.reservationId);
  }
}

