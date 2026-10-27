import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import {
  SALE_READ_REPOSITORY_TOKEN,
  type ISaleReadRepository,
} from '@/sales/domain/repositories/sale.repository.interface';

@Injectable()
export class FindSaleByIdUseCase {
  constructor(
    @Inject(SALE_READ_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleReadRepository,
  ) {}

  async execute(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException(
        `La venta o cotización con ID "${id}" no fue encontrada`,
      );
    }
    return sale;
  }
}
