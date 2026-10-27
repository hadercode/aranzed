import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';

@Injectable()
export class DeleteSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException(
        `El documento de venta con ID "${id}" no existe`,
      );
    }

    // Regla de dominio: validar si la venta permite ser eliminada
    sale.ensureCanBeDeleted();

    await this.saleRepository.delete(id);
  }
}
