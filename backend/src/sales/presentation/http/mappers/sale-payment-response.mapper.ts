import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import { SalePaymentAllocation } from '@/sales/domain/entities/sale-payment-allocation.entity';
import {
  SalePaymentResponseDto,
  SalePaymentAllocationResponseDto,
} from '../dto';

export class SalePaymentResponseMapper {
  static toAllocationDto(
    alloc: SalePaymentAllocation,
  ): SalePaymentAllocationResponseDto {
    const dto = new SalePaymentAllocationResponseDto();
    dto.id = alloc.id;
    dto.paymentId = alloc.paymentId;
    dto.saleId = alloc.saleId;
    dto.saleNumber = alloc.sale?.saleNumber;
    dto.amountAllocated = alloc.amountAllocated;
    dto.amountAllocatedLocal = alloc.amountAllocatedLocal;
    dto.differenceAdjustment = alloc.differenceAdjustment;
    dto.notes = alloc.notes || null;
    dto.createdAt = alloc.createdAt
      ? alloc.createdAt.toISOString()
      : new Date().toISOString();
    return dto;
  }

  static toDto(payment: SalePayment): SalePaymentResponseDto {
    const dto = new SalePaymentResponseDto();
    dto.id = payment.id;
    dto.paymentNumber = payment.paymentNumber;
    dto.customerName = payment.customerName;
    dto.customerTaxId = payment.customerTaxId || null;
    dto.paymentDate = payment.paymentDate
      ? payment.paymentDate.toISOString()
      : new Date().toISOString();
    dto.paymentMethod = payment.paymentMethod;
    dto.reference = payment.reference || null;
    dto.amount = payment.amount;
    dto.amountLocal = payment.amountLocal;
    dto.exchangeRate = payment.exchangeRate;
    dto.currency = payment.currency;
    dto.receiptUrl = payment.receiptUrl || null;
    dto.notes = payment.notes || null;
    dto.status = payment.status;
    dto.createdById = payment.createdById || null;
    dto.createdAt = payment.createdAt
      ? payment.createdAt.toISOString()
      : undefined;
    dto.updatedAt = payment.updatedAt
      ? payment.updatedAt.toISOString()
      : undefined;
    dto.allocations = (payment.allocations || []).map((a) =>
      this.toAllocationDto(a),
    );
    return dto;
  }

  static toDtoList(payments: SalePayment[]): SalePaymentResponseDto[] {
    return (payments || []).map((p) => this.toDto(p));
  }
}
