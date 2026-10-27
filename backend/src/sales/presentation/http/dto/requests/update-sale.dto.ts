import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import { CreateSaleItemDto } from './sale-item.dto';

export class UpdateSaleDto {
  @ApiPropertyOptional({ enum: SaleType })
  @IsOptional()
  @IsEnum(SaleType)
  saleType?: SaleType;

  @ApiPropertyOptional({ enum: SalePaymentTerm })
  @IsOptional()
  @IsEnum(SalePaymentTerm)
  paymentTerm?: SalePaymentTerm;

  @ApiPropertyOptional({ example: '2026-11-30' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: SalePaidStatus })
  @IsOptional()
  @IsEnum(SalePaidStatus)
  paidStatus?: SalePaidStatus;

  @ApiPropertyOptional({ enum: SaleStatus })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiPropertyOptional({ example: 'Consumidor Final' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customerName?: string;

  @ApiPropertyOptional({ example: 'J-12345678-9' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerTaxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  saleDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  validUntil?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  exchangeRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  functionalCurrency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  localCurrency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentCurrency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ type: [CreateSaleItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items?: CreateSaleItemDto[];
}
