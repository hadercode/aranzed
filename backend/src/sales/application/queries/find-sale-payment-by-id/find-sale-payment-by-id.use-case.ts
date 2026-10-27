import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import {
  SALE_PAYMENT_READ_REPOSITORY_TOKEN,
  type ISalePaymentReadRepository,
} from '@/sales/domain/repositories/sale-payment.repository.interface';

@Injectable()
export class FindSalePaymentByIdUseCase {
  constructor(
    @Inject(SALE_PAYMENT_READ_REPOSITORY_TOKEN)
    private readonly readRepo: ISalePaymentReadRepository,
  ) {}

  async execute(id: string): Promise<SalePayment> {
    const payment = await this.readRepo.findById(id);
    if (!payment) {
      throw new NotFoundException(`El cobro con ID "${id}" no fue encontrado`);
    }
    return payment;
  }
}
