import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductOrmEntity } from './infrastructure/persistence/typeorm/entities/product.orm-entity';
import { ProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/repositories/product.repository.interface';
import { ProductController } from './presentation/http/controllers/product.controller';
import { ProductImportController } from './presentation/http/controllers/product-import.controller';

import { CategoriesModule } from '../categories/categories.module';
import { UnitsOfMeasureModule } from '../units-of-measure/units-of-measure.module';

import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler';
import { DeleteProductHandler } from './application/commands/delete-product/delete-product.handler';
import { ValidateProductImportHandler } from './application/commands/validate-product-import/validate-product-import.handler';
import { ExecuteProductImportHandler } from './application/commands/execute-product-import/execute-product-import.handler';

import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { GetProductHandler } from './application/queries/get-product/get-product.handler';
import { GetProductImportTemplateHandler } from './application/queries/get-import-template/get-import-template.handler';

import { UpdateProductCostOnPurchaseListener } from './application/events/update-product-cost-on-purchase.listener';

import { ProductImportTemplateGenerator } from './infrastructure/excel/product-import-template.generator';
import { ProductImportExcelParser } from './infrastructure/excel/product-import-excel.parser';
import { ProductImportValidatorService } from './application/services/product-import-validator.service';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  ValidateProductImportHandler,
  ExecuteProductImportHandler,
];

const QueryHandlers = [
  GetProductsHandler,
  GetProductHandler,
  GetProductImportTemplateHandler,
];

const EventListeners = [UpdateProductCostOnPurchaseListener];

const InfrastructureServices = [
  ProductImportTemplateGenerator,
  ProductImportExcelParser,
];

const ApplicationServices = [ProductImportValidatorService];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CategoriesModule,
    UnitsOfMeasureModule,
  ],
  controllers: [ProductController, ProductImportController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventListeners,
    ...InfrastructureServices,
    ...ApplicationServices,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductRepository,
    },
  ],
  exports: [
    PRODUCT_REPOSITORY_TOKEN,
    ProductImportTemplateGenerator,
    ProductImportExcelParser,
    ProductImportValidatorService,
  ],
})
export class ProductsModule {}
