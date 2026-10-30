import { CreateStockReservationDto } from '@/inventory/stocks/presentation/http/dto/create-stock-reservation.dto';

export class CreateStockReservationCommand {
  constructor(
    public readonly stockId: string,
    public readonly referenceType: string,
    public readonly referenceId: string,
    public readonly reservedQty: number,
    public readonly referenceItemId?: string,
    public readonly secReservedQty?: number,
    public readonly userId?: string,
  ) {}

  static fromDto(
    dto: CreateStockReservationDto,
    userId?: string,
  ): CreateStockReservationCommand {
    return new CreateStockReservationCommand(
      dto.stockId,
      dto.referenceType,
      dto.referenceId,
      dto.reservedQty,
      dto.referenceItemId,
      dto.secReservedQty,
      userId,
    );
  }
}

