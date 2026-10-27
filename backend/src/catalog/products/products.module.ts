import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductOrmEntity } from './infrastructure/persistence/typeorm/entities/product.orm-entity';
import { ProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/repositories/product.repository.interface';
import { ProductController } from './presentation/http/controllers/product.controller';

import { CategoriesModule } from '../categories/categories.module';
import { UnitsOfMeasureModule } from '../units-of-measure/units-of-measure.module';

import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler';
import { DeleteProductHandler } from './application/commands/delete-product/delete-product.handler';
import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { GetProductHandler } from './application/queries/get-product/get-product.handler';
import { UpdateProductCostOnPurchaseListener } from './application/events/update-product-cost-on-purchase.listener';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];

const QueryHandlers = [GetProductsHandler, GetProductHandler];
const EventListeners = [UpdateProductCostOnPurchaseListener];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CategoriesModule,
    UnitsOfMeasureModule,
  ],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventListeners,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY_TOKEN],
})
export class ProductsModule {}
