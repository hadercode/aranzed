import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PURCHASE_REPOSITORY_TOKEN,
  type IPurchaseRepository,
} from '@/purchases/domain/repositories/purchase.repository.interface';

@Injectable()
export class DeletePurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundException(`La compra con ID "${id}" no fue encontrada`);
    }

    // El agregado de Dominio valida sus propias reglas de negocio para borrado
    purchase.ensureCanBeDeleted();

    await this.purchaseRepository.delete(id);
  }
}
