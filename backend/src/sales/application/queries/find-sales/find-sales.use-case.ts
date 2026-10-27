import { Injectable, Inject } from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import {
  SALE_READ_REPOSITORY_TOKEN,
  type ISaleReadRepository,
  type FindSalesFilters,
} from '@/sales/domain/repositories/sale.repository.interface';

@Injectable()
export class FindSalesUseCase {
  constructor(
    @Inject(SALE_READ_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleReadRepository,
  ) {}

  async execute(
    filters?: FindSalesFilters,
  ): Promise<{ sales: Sale[]; total: number }> {
    return this.saleRepository.findAll(filters);
  }
}
