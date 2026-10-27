import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import type { Sale } from './sale.entity';

export class SalePaymentAllocation extends BaseEntity {
  paymentId: string;
  saleId: string;
  amountAllocated: number; // Monto asignado en USD
  amountAllocatedLocal: number; // Monto asignado en VES
  differenceAdjustment: number; // Ajuste / condonación por diferencia mínima
  notes?: string | null;

  sale?: Sale;

  constructor(partial: Partial<SalePaymentAllocation>) {
    super();
    Object.assign(this, partial);
    this.amountAllocated = Number(partial.amountAllocated || 0);
    this.amountAllocatedLocal = Number(partial.amountAllocatedLocal || 0);
    this.differenceAdjustment = Number(partial.differenceAdjustment || 0);
    this.notes = partial.notes?.trim() || null;
  }

  validate(): void {
    if (!this.saleId) {
      throw new BusinessRuleException(
        'La venta asociada es obligatoria en la asignación',
      );
    }
    if (this.amountAllocated <= 0 && this.differenceAdjustment <= 0) {
      throw new BusinessRuleException(
        'El monto asignado o el ajuste de diferencia debe ser mayor a cero',
      );
    }
  }
}
