import { Injectable, Inject } from '@nestjs/common';
import {
  SALE_READ_REPOSITORY_TOKEN,
  type ISaleReadRepository,
  type FindSalesFilters,
  type SaleStatsSummary,
} from '@/sales/domain/repositories/sale.repository.interface';

@Injectable()
export class FindSaleStatsUseCase {
  constructor(
    @Inject(SALE_READ_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleReadRepository,
  ) {}

  async execute(filters?: FindSalesFilters): Promise<SaleStatsSummary> {
    return this.saleRepository.getStats(filters);
  }
}
