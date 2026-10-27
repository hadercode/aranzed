import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import { SaleItemResponseDto } from './sale-item-response.dto';

export class SaleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  saleNumber: string;

  @ApiProperty({ enum: SaleType })
  saleType: SaleType;

  @ApiProperty({ enum: SalePaymentTerm })
  paymentTerm: SalePaymentTerm;

  @ApiPropertyOptional()
  dueDate?: string | null;

  @ApiProperty({ enum: SalePaidStatus })
  paidStatus: SalePaidStatus;

  @ApiProperty({ enum: SaleStatus })
  status: SaleStatus;

  @ApiProperty()
  customerName: string;

  @ApiPropertyOptional()
  customerTaxId?: string | null;

  @ApiPropertyOptional()
  customerEmail?: string | null;

  @ApiPropertyOptional()
  customerPhone?: string | null;

  @ApiPropertyOptional()
  customerAddress?: string | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiPropertyOptional({ enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  paymentNotes?: string | null;

  @ApiProperty()
  saleDate: string;

  @ApiPropertyOptional()
  validUntil?: string | null;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty()
  functionalCurrency: string;

  @ApiProperty()
  localCurrency: string;

  @ApiPropertyOptional()
  documentCurrency?: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  subtotalLocal: number;

  @ApiProperty()
  discountAmountLocal: number;

  @ApiProperty()
  taxAmountLocal: number;

  @ApiProperty()
  totalLocal: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  paidAmountLocal: number;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  balanceLocal: number;

  @ApiPropertyOptional()
  warehouseId?: string | null;

  @ApiPropertyOptional()
  convertedFromQuotationId?: string | null;

  @ApiPropertyOptional()
  createdById?: string | null;

  @ApiPropertyOptional()
  createdAt?: string;

  @ApiPropertyOptional()
  updatedAt?: string;

  @ApiProperty({ type: [SaleItemResponseDto] })
  items: SaleItemResponseDto[];
}
