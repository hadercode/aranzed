import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StockFiltersDto {
  @ApiPropertyOptional({ description: 'Filtrar por almacén' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por producto' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Buscar por SKU o nombre de producto' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Excluir stock agotado', default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  excludeDepleted?: boolean;
}
