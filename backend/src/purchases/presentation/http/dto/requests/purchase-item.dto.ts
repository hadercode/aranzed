import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreatePurchaseItemDto {
  @ApiProperty({
    description: 'UUID del material (producto tipo RAW_MATERIAL) del catálogo',
    example: 'c2e9b889-1c2a-4af8-8b6d-7cb9bd380a11',
  })
  @IsUUID('4', { message: 'El ID del material debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El material es obligatorio' })
  materialId: string;

  @ApiProperty({
    description: 'Descripción o nombre del ítem en la factura',
    example: 'Madera Roble Macizo 2x4 pulg',
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsNotEmpty({ message: 'La descripción del ítem es obligatoria' })
  @MaxLength(255, {
    message: 'La descripción no puede superar los 255 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Cantidad comprada',
    example: 25.5,
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.0001, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({
    description: 'Costo unitario de compra en Moneda Funcional ($ USD) sin IVA',
    example: 12.5,
  })
  @IsNumber({}, { message: 'El costo unitario debe ser un número' })
  @Min(0, { message: 'El costo unitario no puede ser negativo' })
  unitCost: number;

  @ApiPropertyOptional({
    description:
      'Costo unitario en Moneda Local (Bs. VES) (calculado si se omite)',
    example: 562.5,
  })
  @IsOptional()
  @IsNumber()
  unitCostLocal?: number;

  @ApiPropertyOptional({
    description: 'Símbolo de la moneda funcional (por defecto $)',
    default: '$',
    example: '$',
  })
  @IsOptional()
  @IsString()
  currencySymbolFunctional?: string;

  @ApiPropertyOptional({
    description: 'Símbolo de la moneda local (por defecto Bs.)',
    default: 'Bs.',
    example: 'Bs.',
  })
  @IsOptional()
  @IsString()
  currencySymbolLocal?: string;

  @ApiPropertyOptional({
    description:
      'Indica si el ítem es gravable de IVA (true) o exento (false). Por defecto true con 16%',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isTaxable debe ser un booleano' })
  isTaxable?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de alícuota de IVA aplicable (por defecto 16.0)',
    default: 16.0,
    example: 16.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La tasa de IVA debe ser un número' })
  @Min(0, { message: 'La tasa de IVA no puede ser negativa' })
  taxRate?: number;

  @ApiPropertyOptional({
    description: 'Orden del renglón en la factura',
    default: 0,
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Número de lote asignado al material comprado',
    example: 'LOT-202610-001',
  })
  @IsOptional()
  @IsString({ message: 'El número de lote debe ser texto' })
  @MaxLength(100, {
    message: 'El número de lote no puede superar los 100 caracteres',
  })
  batchNumber?: string;

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del lote (YYYY-MM-DD)',
    example: '2027-10-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de vencimiento debe ser una fecha válida (ISO 8601)' },
  )
  expiryDate?: string;
}
