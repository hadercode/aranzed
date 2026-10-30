import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { Product } from '@/catalog/products/domain/entities/product.entity';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import { ExecuteProductImportCommand } from './execute-product-import.command';
import type { BulkImportSummary } from '../../models/bulk-import.models';

@CommandHandler(ExecuteProductImportCommand)
export class ExecuteProductImportHandler
  implements ICommandHandler<ExecuteProductImportCommand, BulkImportSummary>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    command: ExecuteProductImportCommand,
  ): Promise<BulkImportSummary> {
    const validItems = command.items.filter(
      (item) => item.status === 'VALID' && item.resolvedUomId,
    );

    const summary: BulkImportSummary = {
      totalProcessed: command.items.length,
      createdCount: 0,
      failedCount: 0,
      errors: [],
    };

    if (validItems.length === 0) {
      return summary;
    }

    const productsToPersist: Product[] = [];

    for (const item of validItems) {
      try {
        const product = new Product({
          id: randomUUID(),
          name: item.name.trim(),
          description: item.description?.trim() || null,
          imageUrl: item.imageUrl?.trim() || null,
          type: item.type,
          uomId: item.resolvedUomId!,
          categoryId: item.resolvedCategoryId || null,
          profitMargin: item.profitMargin ?? 0,
          lastCost: item.lastCost ?? 0,
          lastSalePrice: item.lastSalePrice ?? 0,
          manageInventory: item.manageInventory,
          isActive: item.isActive !== undefined ? item.isActive : true,
          createdById: command.userId || null,
        });

        product.validate();
        productsToPersist.push(product);
      } catch (err: any) {
        summary.failedCount++;
        summary.errors.push({
          rowNumber: item.rowNumber,
          name: item.name,
          message: err.message || 'Error de validación del artículo',
        });
      }
    }

    if (productsToPersist.length > 0) {
      try {
        const saved = await this.productRepository.saveMany(productsToPersist);
        summary.createdCount = saved.length;
      } catch (err: any) {
        summary.failedCount += productsToPersist.length;
        summary.errors.push({
          message: `Error al persistir productos en base de datos: ${err.message}`,
        });
      }
    }

    return summary;
  }
}
