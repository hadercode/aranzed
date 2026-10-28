import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DashboardController } from './presentation/http/controllers/dashboard.controller';
import { GetDashboardSummaryUseCase } from './application/queries/get-dashboard-summary/get-dashboard-summary.use-case';
import { SalesModule } from '@/sales/sales.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { PurchasesModule } from '@/purchases/purchases.module';
import { InventoryModule } from '@/inventory/inventory.module';

@Module({
  imports: [
    CqrsModule,
    SalesModule,
    CatalogModule,
    PurchasesModule,
    InventoryModule,
  ],
  controllers: [DashboardController],
  providers: [GetDashboardSummaryUseCase],
  exports: [GetDashboardSummaryUseCase],
})
export class DashboardModule {}
