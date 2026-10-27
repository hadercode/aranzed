import { Injectable, Inject } from '@nestjs/common';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import {
  SALE_PAYMENT_READ_REPOSITORY_TOKEN,
  type ISalePaymentReadRepository,
} from '@/sales/domain/repositories/sale-payment.repository.interface';

@Injectable()
export class FindPaymentsBySaleIdUseCase {
  constructor(
    @Inject(SALE_PAYMENT_READ_REPOSITORY_TOKEN)
    private readonly paymentReadRepo: ISalePaymentReadRepository,
  ) {}

  async execute(saleId: string): Promise<SalePayment[]> {
    return this.paymentReadRepo.findBySaleId(saleId);
  }
}
