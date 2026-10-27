import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export class ProductFiltersDto {
  @ApiPropertyOptional({
    enum: ProductType,
    description: 'Filtrar por tipo de producto',
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de categoría',
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de unidad de medida',
  })
  @IsOptional()
  @IsUUID('4')
  uomId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo o inactivo',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Buscar por texto en nombre o descripción',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
