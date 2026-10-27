import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop ThinkPad T14',
    description: 'Nombre del producto o servicio',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  name: string;

  @ApiPropertyOptional({
    example: 'Laptop empresarial 14 pulgadas 16GB RAM 512GB SSD',
    description: 'Descripción detallada del producto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    description: 'URL de la imagen o foto del producto',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    enum: ProductType,
    example: ProductType.TRADITIONAL,
    description: 'Tipo de producto: TRADITIONAL, FINISHED_GOOD o SERVICE',
  })
  @IsEnum(ProductType, {
    message: 'El tipo debe ser TRADITIONAL, FINISHED_GOOD o SERVICE',
  })
  type: ProductType;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'UUID de la unidad de medida (UoM)',
  })
  @IsUUID('4', { message: 'El uomId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La unidad de medida es obligatoria' })
  uomId: string;

  @ApiPropertyOptional({
    example: 'b2c3d4e5-f6a7-8901-2345-678901bcdefa',
    description: 'UUID de la categoría (opcional)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El categoryId debe ser un UUID válido' })
  categoryId?: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'Margen de ganancia en porcentaje (ej: 30 para 30%)',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El margen de ganancia debe ser numérico' })
  @Min(0, { message: 'El margen de ganancia no puede ser negativo' })
  profitMargin?: number;

  @ApiPropertyOptional({
    example: 800,
    description: 'Último costo de adquisición o fabricación',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El último costo debe ser numérico' })
  @Min(0, { message: 'El último costo no puede ser negativo' })
  lastCost?: number;

  @ApiPropertyOptional({
    example: 1040,
    description: 'Último precio de venta sugerido o fijado',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El último precio de venta debe ser numérico' })
  @Min(0, { message: 'El último precio de venta no puede ser negativo' })
  lastSalePrice?: number;

  @ApiPropertyOptional({
    example: true,
    description:
      'Indica si el producto está activo para la venta y operaciones',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Indica si el producto maneja inventario y control de existencias físicas',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  manageInventory?: boolean;
}
