import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export class FindPurchasesQueryDto {
  @ApiPropertyOptional({
    description:
      'Término de búsqueda global (proveedor, número de compra, factura)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por estado de compra',
    enum: PurchaseStatus,
  })
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @ApiPropertyOptional({
    description: 'Filtro por proveedor',
  })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({
    description: 'Fecha inicial (ISO)',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha final (ISO)',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Límite de registros (paginación)',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Desplazamiento / offset (paginación)',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
