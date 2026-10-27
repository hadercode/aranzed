import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure ORM Entities
import { InventoryTransactionOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-transaction.orm-entity';
import { InventoryTransactionItemOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-transaction-item.orm-entity';
import { InventoryStockOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/inventory-stock.orm-entity';
import { StockLedgerEntryOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/stock-ledger-entry.orm-entity';
import { InventoryReasonOrmEntity } from '@/inventory/reasons/infrastructure/persistence/typeorm/entities/inventory-reason.orm-entity';

// Repository Adapter & Tokens
import { TypeOrmInventoryTransactionRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-inventory-transaction.repository';
import {
  INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
  INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
  INVENTORY_TRANSACTION_WRITE_REPOSITORY_TOKEN,
} from './domain/repositories/inventory-transaction.repository.interface';

// Controllers
import { InventoryTransactionsController } from './presentation/http/controllers/inventory-transactions.controller';

// CQRS Use Cases
import { CreateInventoryTransactionUseCase } from './application/commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { UpdateInventoryTransactionUseCase } from './application/commands/update-inventory-transaction/update-inventory-transaction.use-case';
import { DeleteInventoryTransactionUseCase } from './application/commands/delete-inventory-transaction/delete-inventory-transaction.use-case';
import { FindInventoryTransactionsUseCase } from './application/queries/find-inventory-transactions/find-inventory-transactions.use-case';
import { FindInventoryTransactionByIdUseCase } from './application/queries/find-inventory-transaction-by-id/find-inventory-transaction-by-id.use-case';

// Application Services
import { InventoryStockExecutionService } from './application/services/inventory-stock-execution.service';
import { InventoryTransactionsValidationService } from './application/services/inventory-transactions-validation.service';
import { InventoryTransactionsService } from './application/services/inventory-transactions.service';

// CQRS Event Listeners
import { MaterialPurchaseCompletedInventoryListener } from './application/events/material-purchase-completed-inventory.listener';
import { SaleCompletedInventoryListener } from './application/events/sale-completed-inventory.listener';

// External Modules
import { WarehousesModule } from '@/inventory/warehouses/warehouses.module';
import { ProductsModule } from '@/catalog/products/products.module';
import { RecipesModule } from '@/catalog/recipes/recipes.module';

const UseCases = [
  CreateInventoryTransactionUseCase,
  UpdateInventoryTransactionUseCase,
  DeleteInventoryTransactionUseCase,
  FindInventoryTransactionsUseCase,
  FindInventoryTransactionByIdUseCase,
];

const Services = [
  InventoryStockExecutionService,
  InventoryTransactionsValidationService,
  InventoryTransactionsService,
];

const EventListeners = [
  MaterialPurchaseCompletedInventoryListener,
  SaleCompletedInventoryListener,
];

@Module({
  imports: [
    CqrsModule,
    WarehousesModule,
    ProductsModule,
    RecipesModule,
    TypeOrmModule.forFeature([
      InventoryTransactionOrmEntity,
      InventoryTransactionItemOrmEntity,
      InventoryStockOrmEntity,
      StockLedgerEntryOrmEntity,
      InventoryReasonOrmEntity,
    ]),
  ],
  controllers: [InventoryTransactionsController],
  providers: [
    ...UseCases,
    ...Services,
    ...EventListeners,
    TypeOrmInventoryTransactionRepository,
    {
      provide: INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
      useClass: TypeOrmInventoryTransactionRepository,
    },
    {
      provide: INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
      useExisting: INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
    },
    {
      provide: INVENTORY_TRANSACTION_WRITE_REPOSITORY_TOKEN,
      useExisting: INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
    },
  ],
  exports: [
    INVENTORY_TRANSACTION_REPOSITORY_TOKEN,
    INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
    INVENTORY_TRANSACTION_WRITE_REPOSITORY_TOKEN,
    ...UseCases,
    ...Services,
    TypeOrmModule,
  ],
})
export class InventoryTransactionsModule {}
