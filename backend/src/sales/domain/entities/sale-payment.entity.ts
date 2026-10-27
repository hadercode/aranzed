import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { SalePaymentAllocation } from './sale-payment-allocation.entity';

export class SalePayment extends BaseEntity {
  paymentNumber: string;
  customerName: string;
  customerTaxId?: string | null;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string | null;
  amount: number; // Monto total en USD
  amountLocal: number; // Monto total en VES
  exchangeRate: number;
  currency: string; // 'USD' | 'VES'
  receiptUrl?: string | null;
  notes?: string | null;
  status: PaymentStatus;
  createdById?: string | null;
  deletedAt?: Date | null;

  allocations: SalePaymentAllocation[];

  constructor(partial: Partial<SalePayment>) {
    super();
    Object.assign(this, partial);
    this.customerName = partial.customerName?.trim() || '';
    this.customerTaxId = partial.customerTaxId?.trim() || null;
    this.paymentDate = partial.paymentDate
      ? new Date(partial.paymentDate)
      : new Date();
    this.paymentMethod = partial.paymentMethod || PaymentMethod.CASH;
    this.reference = partial.reference?.trim() || null;
    this.exchangeRate = Number(partial.exchangeRate || 1.0);
    this.currency = partial.currency || 'USD';
    this.amount = Number(partial.amount || 0);
    this.amountLocal = Number(
      partial.amountLocal ||
        (this.currency === 'VES'
          ? this.amount
          : this.amount * this.exchangeRate),
    );
    this.receiptUrl = partial.receiptUrl?.trim() || null;
    this.notes = partial.notes?.trim() || null;
    this.status = partial.status || PaymentStatus.CONFIRMED;
    this.allocations = partial.allocations
      ? partial.allocations.map((a) =>
          a instanceof SalePaymentAllocation ? a : new SalePaymentAllocation(a),
        )
      : [];
  }

  validate(): void {
    if (!this.paymentNumber || this.paymentNumber.trim().length === 0) {
      throw new BusinessRuleException(
        'El número de comprobante o cobro es obligatorio',
      );
    }
    if (!this.customerName || this.customerName.trim().length === 0) {
      throw new BusinessRuleException('El nombre del cliente es obligatorio');
    }
    if (this.amount <= 0 && this.amountLocal <= 0) {
      throw new BusinessRuleException('El monto cobrado debe ser mayor a cero');
    }
    if (this.exchangeRate <= 0) {
      throw new BusinessRuleException(
        'La tasa de cambio del cobro debe ser mayor a cero',
      );
    }
    if (!this.allocations || this.allocations.length === 0) {
      throw new BusinessRuleException(
        'El cobro debe tener al menos una venta asignada',
      );
    }

    const totalAllocated = this.calculateTotalAllocated();
    // Validar que lo asignado no exceda el monto total (con margen de redondeo de $0.05)
    if (totalAllocated > this.amount + 0.05) {
      throw new BusinessRuleException(
        `El total asignado ($${totalAllocated.toFixed(2)}) no puede exceder el monto total del cobro ($${this.amount.toFixed(2)})`,
      );
    }

    for (const alloc of this.allocations) {
      alloc.validate();
    }
  }

  calculateTotalAllocated(): number {
    return Number(
      (this.allocations || [])
        .reduce((sum, a) => sum + Number(a.amountAllocated || 0), 0)
        .toFixed(4),
    );
  }

  calculateTotalAllocatedLocal(): number {
    return Number(
      (this.allocations || [])
        .reduce((sum, a) => sum + Number(a.amountAllocatedLocal || 0), 0)
        .toFixed(4),
    );
  }

  cancel(): void {
    if (this.status === PaymentStatus.CANCELLED) {
      throw new BusinessRuleException('El cobro ya se encuentra anulado');
    }
    this.status = PaymentStatus.CANCELLED;
  }
}
