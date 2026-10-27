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
}
