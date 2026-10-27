import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { PurchaseOrmEntity } from './infrastructure/persistence/typeorm/entities/purchase.orm-entity';
import { PurchaseItemOrmEntity } from './infrastructure/persistence/typeorm/entities/purchase-item.orm-entity';
import { TypeOrmPurchaseRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-purchase.repository';
import {
  PURCHASE_REPOSITORY_TOKEN,
  PURCHASE_READ_REPOSITORY_TOKEN,
  PURCHASE_WRITE_REPOSITORY_TOKEN,
} from './domain/repositories/purchase.repository.interface';

import { PurchasesController } from './presentation/http/controllers/purchases.controller';

import { CreatePurchaseUseCase } from './application/commands/create-purchase/create-purchase.use-case';
import { UpdatePurchaseUseCase } from './application/commands/update-purchase/update-purchase.use-case';
import { UpdatePurchaseStatusUseCase } from './application/commands/update-purchase-status/update-purchase-status.use-case';
import { DeletePurchaseUseCase } from './application/commands/delete-purchase/delete-purchase.use-case';
import { FindPurchasesUseCase } from './application/queries/find-purchases/find-purchases.use-case';
import { FindPurchaseByIdUseCase } from './application/queries/find-purchase-by-id/find-purchase-by-id.use-case';
import { MaterialPurchaseCompletedListener } from './application/events/material-purchase-completed.listener';

import { ProductsModule } from '@/catalog/products/products.module';
import {
  PurchaseCompletionService,
  PurchaseItemsService,
} from './application/services';

const UseCases = [
  CreatePurchaseUseCase,
  UpdatePurchaseUseCase,
  UpdatePurchaseStatusUseCase,
  DeletePurchaseUseCase,
  FindPurchasesUseCase,
  FindPurchaseByIdUseCase,
];

const Services = [PurchaseCompletionService, PurchaseItemsService];

const EventListeners = [MaterialPurchaseCompletedListener];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PurchaseOrmEntity, PurchaseItemOrmEntity]),
    ProductsModule,
  ],
  controllers: [PurchasesController],
  providers: [
    ...UseCases,
    ...Services,
    ...EventListeners,
    {
      provide: PURCHASE_REPOSITORY_TOKEN,
      useClass: TypeOrmPurchaseRepository,
    },
    {
      provide: PURCHASE_READ_REPOSITORY_TOKEN,
      useExisting: PURCHASE_REPOSITORY_TOKEN,
    },
    {
      provide: PURCHASE_WRITE_REPOSITORY_TOKEN,
      useExisting: PURCHASE_REPOSITORY_TOKEN,
    },
  ],
  exports: [
    PURCHASE_REPOSITORY_TOKEN,
    PURCHASE_READ_REPOSITORY_TOKEN,
    PURCHASE_WRITE_REPOSITORY_TOKEN,
    ...UseCases,
    ...Services,
  ],
})
export class PurchasesModule {}
