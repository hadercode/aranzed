import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { PaymentStatus } from '@/sales/domain/enums/payment-status.enum';

export class SalePaymentAllocationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  saleId: string;

  @ApiPropertyOptional()
  saleNumber?: string;

  @ApiProperty()
  amountAllocated: number;

  @ApiProperty()
  amountAllocatedLocal: number;

  @ApiProperty()
  differenceAdjustment: number;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  createdAt: string;
}

export class SalePaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentNumber: string;

  @ApiProperty()
  customerName: string;

  @ApiPropertyOptional()
  customerTaxId?: string | null;

  @ApiProperty()
  paymentDate: string;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  reference?: string | null;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  amountLocal: number;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  receiptUrl?: string | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional()
  createdById?: string | null;

  @ApiPropertyOptional()
  createdAt?: string;

  @ApiPropertyOptional()
  updatedAt?: string;

  @ApiProperty({ type: [SalePaymentAllocationResponseDto] })
  allocations: SalePaymentAllocationResponseDto[];
}
