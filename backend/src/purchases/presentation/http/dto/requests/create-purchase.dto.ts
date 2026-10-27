import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import { CreatePurchaseItemDto } from './purchase-item.dto';

export class CreatePurchaseDto {
  @ApiPropertyOptional({
    description:
      'Número correlativo de la compra (autogenerado si se omite, ej: COM-0001)',
    example: 'COM-0001',
  })
  @IsOptional()
  @IsString({ message: 'El número de compra debe ser texto' })
  @MaxLength(30, {
    message: 'El número de compra no puede superar los 30 caracteres',
  })
  purchaseNumber?: string;

  @ApiProperty({
    description: 'Nombre o Razón Social del Proveedor',
    example: 'Maderas y Herrajes del Norte C.A.',
  })
  @IsString({ message: 'El nombre del proveedor debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del proveedor es obligatorio' })
  @MaxLength(150, {
    message: 'El nombre del proveedor no puede superar los 150 caracteres',
  })
  supplierName: string;

  @ApiProperty({
    description: 'Fecha de emisión de la compra / factura',
    example: '2026-10-12T12:00:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'La fecha de compra debe ser una fecha válida (ISO 8601)' },
  )
  purchaseDate: string;

  @ApiPropertyOptional({
    description:
      'Tasa de cambio entre Moneda Funcional (USD) y Moneda Local (VES)',
    default: 1.0,
    example: 45.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La tasa de cambio debe ser un número' })
  @Min(0.0001, { message: 'La tasa de cambio debe ser mayor a cero' })
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Código de moneda funcional (por defecto USD)',
    default: 'USD',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  functionalCurrency?: string;

  @ApiPropertyOptional({
    description: 'Código de moneda local (por defecto VES)',
    default: 'VES',
    example: 'VES',
  })
  @IsOptional()
  @IsString()
  localCurrency?: string;

  @ApiPropertyOptional({
    description:
      'Moneda origen en la que se emitió el comprobante/factura física',
    example: 'USD',
  })
  @IsOptional()
  @IsString({ message: 'La moneda del documento debe ser una cadena de texto' })
  documentCurrency?: string;

  @ApiPropertyOptional({
    description: 'Observaciones o descripción general de la compra',
    example: 'Adquisición de lotes de madera para producción de escritorios',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Estado inicial de la compra',
    enum: PurchaseStatus,
    default: PurchaseStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(PurchaseStatus, { message: 'El estado de la compra no es válido' })
  status?: PurchaseStatus;

  @ApiPropertyOptional({
    description:
      'UUID del almacén de destino donde ingresa la mercancía comprada',
    example: 'c2e9b889-1c2a-4af8-8b6d-7cb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del almacén debe ser un UUID válido' })
  warehouseId?: string;

  @ApiProperty({
    description: 'Número de factura, control o documento del proveedor',
    example: 'FAC-2026-9812',
  })
  @IsString({ message: 'El número de factura o documento debe ser texto' })
  @IsNotEmpty({ message: 'El número de factura o documento es obligatorio' })
  @MaxLength(50, {
    message:
      'El número de factura o documento no puede superar los 50 caracteres',
  })
  invoiceNumber: string;

  @ApiProperty({
    description: 'Lista de materiales comprados con costo, cantidad e IVA',
    type: [CreatePurchaseItemDto],
  })
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ArrayMinSize(1, {
    message: 'Debe ingresar al menos un ítem o material en la compra',
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];
}
