import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';

export class TransactionFiltersDto {
  @ApiPropertyOptional({ enum: InventoryTransactionType })
  @IsOptional()
  @IsEnum(InventoryTransactionType)
  type?: InventoryTransactionType;

  @ApiPropertyOptional({ enum: InventoryTransactionStatus })
  @IsOptional()
  @IsEnum(InventoryTransactionStatus)
  status?: InventoryTransactionStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por almacén (origen o destino)',
  })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'Buscar por número de transacción o referencia',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Fecha desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Número de página (1-based)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo de ordenamiento',
    default: 'movementDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento (ASC o DESC)',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
