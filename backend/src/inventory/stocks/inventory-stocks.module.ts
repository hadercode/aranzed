import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryStockOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-stock.orm-entity';
import { StockReservationOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-reservation.orm-entity';
import { StockLedgerEntryOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-ledger-entry.orm-entity';
import { InventoryAdjustmentReportOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-adjustment-report.orm-entity';
import { InventoryStocksService } from './application/services/inventory-stocks.service';
import { InventoryStocksController } from './presentation/http/controllers/inventory-stocks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryStockOrmEntity,
      StockReservationOrmEntity,
      StockLedgerEntryOrmEntity,
      InventoryAdjustmentReportOrmEntity,
    ]),
  ],
  controllers: [InventoryStocksController],
  providers: [InventoryStocksService],
  exports: [InventoryStocksService, TypeOrmModule],
})
export class InventoryStocksModule {}
