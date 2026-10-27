import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateProductCommand } from './create-product.command';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Product } from '@/catalog/products/domain/entities/product.entity';
import {
  BusinessRuleException,
  EntityNotFoundException,
} from '@/core/domain/domain-exception';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly uomRepository: IUnitOfMeasureRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const existing = await this.productRepository.findByName(command.name);
    if (existing) {
      throw new BusinessRuleException(
        `Ya existe un producto con el nombre "${command.name}"`,
      );
    }

    const uom = await this.uomRepository.findById(command.uomId);
    if (!uom) {
      throw new EntityNotFoundException('Unidad de medida', command.uomId);
    }

    if (command.categoryId) {
      const category = await this.categoryRepository.findById(
        command.categoryId,
      );
      if (!category) {
        throw new EntityNotFoundException('Categoría', command.categoryId);
      }
    }

    const product = new Product({
      id: randomUUID(),
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      type: command.type,
      uomId: command.uomId,
      categoryId: command.categoryId,
      profitMargin: command.profitMargin ?? 0,
      lastCost: command.lastCost ?? 0,
      lastSalePrice: command.lastSalePrice ?? 0,
      isActive: command.isActive !== undefined ? command.isActive : true,
      manageInventory: command.manageInventory,
      createdById: command.createdById,
    });

    product.validate();

    return this.productRepository.save(product);
  }
}
