import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryStockOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-stock.orm-entity';
import { StockReservationOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-reservation.orm-entity';
import { StockLedgerEntryOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-ledger-entry.orm-entity';
import { InventoryAdjustmentReportOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-adjustment-report.orm-entity';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';

import { ProductsModule } from '@/catalog/products/products.module';
import { WarehousesModule } from '@/inventory/warehouses/warehouses.module';
import { InventoryTransactionsModule } from '@/inventory/transactions/inventory-transactions.module';

import { InventoryStocksService } from './application/services/inventory-stocks.service';
import { InventoryStocksController } from './presentation/http/controllers/inventory-stocks.controller';
import { StockImportController } from './presentation/http/controllers/stock-import.controller';

import { StockImportTemplateGenerator } from './infrastructure/excel/stock-import-template.generator';
import { StockImportExcelParser } from './infrastructure/excel/stock-import-excel.parser';
import { StockImportValidatorService } from './application/services/stock-import-validator.service';

import { GetStockImportTemplateHandler } from './application/queries/get-stock-import-template/get-stock-import-template.handler';
import { GetStocksHandler } from './application/queries/get-stocks/get-stocks.handler';
import { GetStockLedgerHandler } from './application/queries/get-stock-ledger/get-stock-ledger.handler';
import { GetAdjustmentsReportHandler } from './application/queries/get-adjustments-report/get-adjustments-report.handler';

import { ValidateStockImportHandler } from './application/commands/validate-stock-import/validate-stock-import.handler';
import { ExecuteStockImportHandler } from './application/commands/execute-stock-import/execute-stock-import.handler';
import { CreateStockReservationHandler } from './application/commands/create-stock-reservation/create-stock-reservation.handler';
import { ReleaseStockReservationHandler } from './application/commands/release-stock-reservation/release-stock-reservation.handler';

const CommandHandlers = [
  ValidateStockImportHandler,
  ExecuteStockImportHandler,
  CreateStockReservationHandler,
  ReleaseStockReservationHandler,
];

const QueryHandlers = [
  GetStockImportTemplateHandler,
  GetStocksHandler,
  GetStockLedgerHandler,
  GetAdjustmentsReportHandler,
];

const InfrastructureServices = [
  StockImportTemplateGenerator,
  StockImportExcelParser,
];

const ApplicationServices = [
  InventoryStocksService,
  StockImportValidatorService,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      InventoryStockOrmEntity,
      StockReservationOrmEntity,
      StockLedgerEntryOrmEntity,
      InventoryAdjustmentReportOrmEntity,
      WarehouseOrmEntity,
    ]),
    ProductsModule,
    WarehousesModule,
    InventoryTransactionsModule,
  ],
  controllers: [InventoryStocksController, StockImportController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...InfrastructureServices,
    ...ApplicationServices,
  ],
  exports: [InventoryStocksService, TypeOrmModule],
})
export class InventoryStocksModule {}
