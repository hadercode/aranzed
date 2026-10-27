import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { DeleteProductCommand } from './delete-product.command';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import { EntityNotFoundException } from '@/core/domain/domain-exception';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.id);
    if (!product) {
      throw new EntityNotFoundException('Producto', command.id);
    }
    await this.productRepository.delete(command.id);
  }
}
