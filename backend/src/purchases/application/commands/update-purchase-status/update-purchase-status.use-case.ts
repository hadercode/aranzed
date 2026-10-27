import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import {
  PURCHASE_REPOSITORY_TOKEN,
  type IPurchaseRepository,
} from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseCompletionService } from '@/purchases/application/services';
import { UpdatePurchaseStatusCommand } from './update-purchase-status.command';

@Injectable()
export class UpdatePurchaseStatusUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly purchaseCompletionService: PurchaseCompletionService,
  ) {}

  async execute(command: UpdatePurchaseStatusCommand): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(command.id);
    if (!purchase) {
      throw new NotFoundException(
        `La compra con ID "${command.id}" no fue encontrada`,
      );
    }

    if (purchase.status === command.status) {
      return purchase;
    }

    const previousStatus = purchase.status;

    // El agregado de Dominio encapsula y valida la transición de estado
    purchase.transitionTo(command.status);

    const saved = await this.purchaseRepository.save(purchase);

    // Si transitó hacia COMPLETED: orquestar eventos
    if (
      previousStatus !== PurchaseStatus.COMPLETED &&
      saved.status === PurchaseStatus.COMPLETED
    ) {
      await this.purchaseCompletionService.completePurchase(saved);
    }

    return saved;
  }
}
