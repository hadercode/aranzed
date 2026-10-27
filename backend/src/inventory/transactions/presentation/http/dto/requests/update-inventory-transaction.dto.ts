import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';

export class UpdateInventoryTransactionDto {
  @ApiPropertyOptional({ description: 'Notas u observaciones actualizadas' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Fecha del movimiento (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  movementDate?: string;

  @ApiPropertyOptional({
    description: 'Estado de la transacción',
    enum: InventoryTransactionStatus,
  })
  @IsEnum(InventoryTransactionStatus)
  @IsOptional()
  status?: InventoryTransactionStatus;
}
