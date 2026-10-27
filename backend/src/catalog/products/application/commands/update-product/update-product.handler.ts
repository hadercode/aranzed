import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UpdateProductCommand } from './update-product.command';
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

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly uomRepository: IUnitOfMeasureRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const product = await this.productRepository.findById(command.id);
    if (!product) {
      throw new EntityNotFoundException('Producto', command.id);
    }

    const { payload } = command;

    if (payload.name && payload.name.trim() !== product.name) {
      const existing = await this.productRepository.findByName(payload.name);
      if (existing && existing.id !== product.id) {
        throw new BusinessRuleException(
          `Ya existe un producto con el nombre "${payload.name}"`,
        );
      }
      product.name = payload.name;
    }

    if (payload.uomId && payload.uomId !== product.uomId) {
      const uom = await this.uomRepository.findById(payload.uomId);
      if (!uom) {
        throw new EntityNotFoundException('Unidad de medida', payload.uomId);
      }
      product.uomId = payload.uomId;
    }

    if (payload.categoryId !== undefined) {
      if (payload.categoryId && payload.categoryId !== product.categoryId) {
        const cat = await this.categoryRepository.findById(payload.categoryId);
        if (!cat) {
          throw new EntityNotFoundException('Categoría', payload.categoryId);
        }
      }
      product.categoryId = payload.categoryId;
    }

    if (payload.description !== undefined) {
      product.description = payload.description;
    }
    if (payload.imageUrl !== undefined) {
      product.imageUrl = payload.imageUrl;
    }
    if (payload.type !== undefined) {
      product.type = payload.type;
    }
    if (payload.profitMargin !== undefined) {
      product.profitMargin = Number(payload.profitMargin);
    }
    if (payload.lastCost !== undefined) {
      product.lastCost = Number(payload.lastCost);
    }
    if (payload.lastSalePrice !== undefined) {
      product.lastSalePrice = Number(payload.lastSalePrice);
    }
    if (payload.isActive !== undefined) {
      product.isActive = payload.isActive;
    }
    if (payload.manageInventory !== undefined) {
      product.manageInventory = payload.manageInventory;
    }

    product.validate();

    return this.productRepository.save(product);
  }
}
