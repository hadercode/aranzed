import { Module } from '@nestjs/common';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoryReasonsModule } from './reasons/inventory-reasons.module';
import { InventoryStocksModule } from './stocks/inventory-stocks.module';
import { InventoryTransactionsModule } from './transactions/inventory-transactions.module';

@Module({
  imports: [
    WarehousesModule,
    InventoryReasonsModule,
    InventoryStocksModule,
    InventoryTransactionsModule,
  ],
  exports: [
    WarehousesModule,
    InventoryReasonsModule,
    InventoryStocksModule,
    InventoryTransactionsModule,
  ],
})
export class InventoryModule {}
