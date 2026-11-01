import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleItemDto {
  @ApiPropertyOptional({
    description: 'ID interno del ítem en caso de actualización o edición',
    example: 'c2e9b889-1c2a-4af8-8b6d-7cb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del ítem debe ser un UUID válido' })
  id?: string;

  @ApiProperty({ description: 'ID del producto en catálogo' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El producto es obligatorio' })
  productId: string;

  @ApiPropertyOptional({
    description: 'Descripción o notas personalizadas del ítem',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Tipo de producto en el catálogo (ej: TRADITIONAL, SERVICE, FINISHED_GOOD)',
    example: 'TRADITIONAL',
  })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiProperty({ description: 'Cantidad vendida o cotizada', example: 1 })
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad debe ser un número válido' })
  @Min(0.0001, { message: 'La cantidad debe ser mayor a cero' })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario de venta (USD)', example: 25.5 })
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio unitario debe ser un número válido' })
  @Min(0, { message: 'El precio unitario no puede ser negativo' })
  unitPrice: number;

  @ApiPropertyOptional({
    description: 'Costo unitario referencial del producto',
    example: 10.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitCost?: number;

  @ApiPropertyOptional({
    description: 'Porcentaje de descuento aplicado (0 a 100)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate?: number;

  @ApiPropertyOptional({
    description: 'Indica si aplica impuesto IVA',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de alícuota de impuesto',
    default: 16.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({
    description: 'Orden de despliegue en el detalle',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Precio unitario en moneda local (Bs.)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitPriceLocal?: number;

  @ApiPropertyOptional({
    description: 'Subtotal en moneda local (Bs.)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subtotalLocal?: number;

  @ApiPropertyOptional({
    description: 'Total con impuestos en moneda local (Bs.)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalLocal?: number;
}
