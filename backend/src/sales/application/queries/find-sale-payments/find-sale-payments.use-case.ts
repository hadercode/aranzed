import { Injectable, Inject } from '@nestjs/common';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import {
  SALE_PAYMENT_READ_REPOSITORY_TOKEN,
  type ISalePaymentReadRepository,
  type FindSalePaymentsFilters,
} from '@/sales/domain/repositories/sale-payment.repository.interface';

@Injectable()
export class FindSalePaymentsUseCase {
  constructor(
    @Inject(SALE_PAYMENT_READ_REPOSITORY_TOKEN)
    private readonly readRepo: ISalePaymentReadRepository,
  ) {}

  async execute(
    filters?: FindSalePaymentsFilters,
  ): Promise<{ payments: SalePayment[]; total: number }> {
    return this.readRepo.findAll(filters);
  }
}
