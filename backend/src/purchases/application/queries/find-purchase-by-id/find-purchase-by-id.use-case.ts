import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  PURCHASE_READ_REPOSITORY_TOKEN,
  type IPurchaseReadRepository,
} from '@/purchases/domain/repositories/purchase.repository.interface';

@Injectable()
export class FindPurchaseByIdUseCase {
  constructor(
    @Inject(PURCHASE_READ_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseReadRepository,
  ) {}

  async execute(id: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundException(`La compra con ID "${id}" no fue encontrada`);
    }
    return purchase;
  }
}
