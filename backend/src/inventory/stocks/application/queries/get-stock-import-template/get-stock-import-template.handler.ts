import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';
import { StockImportTemplateGenerator } from '@/inventory/stocks/infrastructure/excel/stock-import-template.generator';
import { GetStockImportTemplateQuery } from './get-stock-import-template.query';

@QueryHandler(GetStockImportTemplateQuery)
export class GetStockImportTemplateHandler
  implements IQueryHandler<GetStockImportTemplateQuery, Buffer>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @InjectRepository(WarehouseOrmEntity)
    private readonly warehouseRepo: Repository<WarehouseOrmEntity>,
    private readonly templateGenerator: StockImportTemplateGenerator,
  ) {}

  async execute(): Promise<Buffer> {
    const [allProducts, warehouses] = await Promise.all([
      this.productRepository.findAll(),
      this.warehouseRepo.find({ order: { name: 'ASC' } }),
    ]);

    // Incluir todos los artículos físicos (materias primas, productos terminados, productos tradicionales)
    // que gestionan inventario, independientemente de si están activos para la venta (excluyendo solo servicios)
    const inventoryProducts = allProducts.filter(
      (p) => p.type !== ProductType.SERVICE && p.manageInventory !== false,
    );

    return this.templateGenerator.generate(inventoryProducts, warehouses);
  }
}
