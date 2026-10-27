import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';

export class SalePaymentAllocationDto {
  @ApiProperty({ description: 'ID de la venta a abonar' })
  @IsUUID()
  @IsNotEmpty()
  saleId: string;

  @ApiProperty({ description: 'Monto asignado en USD' })
  @IsNumber()
  @Min(0)
  amountAllocated: number;

  @ApiPropertyOptional({ description: 'Monto asignado en VES' })
  @IsNumber()
  @IsOptional()
  amountAllocatedLocal?: number;

  @ApiPropertyOptional({
    description: 'Ajuste / condonación de diferencia mínima para cerrar venta',
  })
  @IsNumber()
  @IsOptional()
  differenceAdjustment?: number;

  @ApiPropertyOptional({ description: 'Notas de la asignación' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateSalePaymentDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiPropertyOptional({ description: 'Identificación fiscal / RIF' })
  @IsString()
  @IsOptional()
  customerTaxId?: string;

  @ApiPropertyOptional({ description: 'Fecha del pago' })
  @IsOptional()
  paymentDate?: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({
    description: 'N° de referencia / comprobante bancario',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ description: 'Monto total pagado en USD' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Monto total pagado en VES' })
  @IsNumber()
  @IsOptional()
  amountLocal?: number;

  @ApiPropertyOptional({ description: 'Tasa de cambio del día' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Moneda del pago (USD o VES)',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del comprobante subido',
  })
  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @ApiPropertyOptional({ description: 'Notas u observaciones del pago' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [SalePaymentAllocationDto],
    description: 'Ventas a las que se aplica el cobro',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalePaymentAllocationDto)
  allocations: SalePaymentAllocationDto[];
}
