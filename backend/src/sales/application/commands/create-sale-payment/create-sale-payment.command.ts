import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';

export interface CreateSalePaymentAllocationItem {
  saleId: string;
  amountAllocated: number; // Monto asignado en USD
  amountAllocatedLocal?: number; // Monto asignado en VES
  differenceAdjustment?: number; // Condonación / ajuste por diferencia mínima
  notes?: string;
}

export interface CreateSalePaymentInput {
  customerName: string;
  customerTaxId?: string;
  paymentDate?: string | Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  amount: number;
  amountLocal?: number;
  exchangeRate?: number;
  currency?: string;
  receiptUrl?: string;
  notes?: string;
  allocations: CreateSalePaymentAllocationItem[];
}

export class CreateSalePaymentCommand {
  constructor(
    public readonly customerName: string,
    public readonly paymentDate: Date,
    public readonly paymentMethod: PaymentMethod,
    public readonly amount: number,
    public readonly exchangeRate: number,
    public readonly currency: string,
    public readonly allocations: CreateSalePaymentAllocationItem[],
    public readonly customerTaxId?: string,
    public readonly reference?: string,
    public readonly amountLocal?: number,
    public readonly receiptUrl?: string,
    public readonly notes?: string,
    public readonly userId?: string,
  ) {}

  static fromDto(
    dto: CreateSalePaymentInput,
    userId?: string,
  ): CreateSalePaymentCommand {
    return new CreateSalePaymentCommand(
      dto.customerName,
      dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      dto.paymentMethod,
      Number(dto.amount),
      Number(dto.exchangeRate || 1.0),
      dto.currency || 'USD',
      dto.allocations || [],
      dto.customerTaxId,
      dto.reference,
      dto.amountLocal ? Number(dto.amountLocal) : undefined,
      dto.receiptUrl,
      dto.notes,
      userId,
    );
  }
}
