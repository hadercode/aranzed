import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import { CreateSaleItemDto } from './sale-item.dto';

export class CreateSaleDto {
  @ApiPropertyOptional({
    description: 'Tipo de documento comercial',
    enum: SaleType,
    default: SaleType.DIRECT_SALE,
  })
  @IsOptional()
  @IsEnum(SaleType, {
    message: 'El tipo de documento debe ser QUOTATION o DIRECT_SALE',
  })
  saleType?: SaleType;

  @ApiPropertyOptional({
    description: 'Término o condición de pago comercial',
    enum: SalePaymentTerm,
    default: SalePaymentTerm.CONTADO,
  })
  @IsOptional()
  @IsEnum(SalePaymentTerm, {
    message: 'El término de pago debe ser CONTADO o CREDITO',
  })
  paymentTerm?: SalePaymentTerm;

  @ApiPropertyOptional({
    description:
      'Fecha límite de vencimiento (requerida si paymentTerm es CREDITO)',
    example: '2026-11-30',
  })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Estado de pago de la venta',
    enum: SalePaidStatus,
    default: SalePaidStatus.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(SalePaidStatus, {
    message: 'El estado de pago debe ser PENDIENTE, ABONADO o PAGADO',
  })
  paidStatus?: SalePaidStatus;

  @ApiPropertyOptional({
    description: 'Estado inicial del documento',
    enum: SaleStatus,
    default: SaleStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(SaleStatus, { message: 'El estado no es válido' })
  status?: SaleStatus;

  @ApiProperty({
    description: 'Nombre o razón social del cliente',
    example: 'Consumidor Final',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  @MaxLength(150, {
    message: 'El nombre del cliente no puede exceder los 150 caracteres',
  })
  customerName: string;

  @ApiPropertyOptional({
    description: 'Identificación fiscal o cédula (NIT/RIF/CI)',
    example: 'J-12345678-9',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerTaxId?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico de contacto' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Dirección física de entrega o facturación',
  })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiPropertyOptional({ description: 'Observaciones o condiciones' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Método de pago pactado',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'El método de pago no es válido' })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Referencia bancaria o detalle del pago',
  })
  @IsOptional()
  @IsString()
  paymentNotes?: string;

  @ApiPropertyOptional({ description: 'Fecha de emisión (ISO string o Date)' })
  @IsOptional()
  saleDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de validez de la cotización' })
  @IsOptional()
  validUntil?: string;

  @ApiPropertyOptional({
    description: 'Tasa de cambio del día respecto a moneda local',
    default: 1.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.0001, { message: 'La tasa de cambio debe ser mayor a cero' })
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Moneda funcional del sistema',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  functionalCurrency?: string;

  @ApiPropertyOptional({ description: 'Moneda local del país', default: 'VES' })
  @IsOptional()
  @IsString()
  localCurrency?: string;

  @ApiPropertyOptional({
    description: 'Moneda de emisión del documento',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  documentCurrency?: string;

  @ApiPropertyOptional({
    description: 'ID del almacén de origen para salida de inventario',
  })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'Correlativo personalizado manual (opcional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  saleNumber?: string;

  @ApiProperty({
    description: 'Lista de productos que componen la venta o cotización',
    type: [CreateSaleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}
