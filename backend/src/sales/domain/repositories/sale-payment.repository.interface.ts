import { SalePayment } from '../entities/sale-payment.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export const SALE_PAYMENT_REPOSITORY_TOKEN = 'ISalePaymentRepository';
export const SALE_PAYMENT_READ_REPOSITORY_TOKEN = 'ISalePaymentReadRepository';
export const SALE_PAYMENT_WRITE_REPOSITORY_TOKEN =
  'ISalePaymentWriteRepository';

export interface FindSalePaymentsFilters {
  search?: string;
  customerName?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface ISalePaymentReadRepository {
  findAll(
    filters?: FindSalePaymentsFilters,
  ): Promise<{ payments: SalePayment[]; total: number }>;
  findById(id: string): Promise<SalePayment | null>;
  findByPaymentNumber(paymentNumber: string): Promise<SalePayment | null>;
  findBySaleId(saleId: string): Promise<SalePayment[]>;
}

export interface ISalePaymentWriteRepository {
  save(payment: SalePayment): Promise<SalePayment>;
  getNextSequenceNumber(): Promise<string>;
}

export interface ISalePaymentRepository
  extends ISalePaymentReadRepository, ISalePaymentWriteRepository {}
