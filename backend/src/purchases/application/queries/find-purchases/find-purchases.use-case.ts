import { Injectable, Inject } from '@nestjs/common';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  PURCHASE_READ_REPOSITORY_TOKEN,
  type IPurchaseReadRepository,
  type FindPurchasesFilters,
} from '@/purchases/domain/repositories/purchase.repository.interface';

@Injectable()
export class FindPurchasesUseCase {
  constructor(
    @Inject(PURCHASE_READ_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseReadRepository,
  ) {}

  async execute(
    filters?: FindPurchasesFilters,
  ): Promise<{ purchases: Purchase[]; total: number }> {
    return this.purchaseRepository.findAll(filters);
  }
}
