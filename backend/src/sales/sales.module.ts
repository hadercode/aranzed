import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { SaleOrmEntity } from './infrastructure/persistence/typeorm/entities/sale.orm-entity';
import { SaleItemOrmEntity } from './infrastructure/persistence/typeorm/entities/sale-item.orm-entity';
import { SalePaymentOrmEntity } from './infrastructure/persistence/typeorm/entities/sale-payment.orm-entity';
import { SalePaymentAllocationOrmEntity } from './infrastructure/persistence/typeorm/entities/sale-payment-allocation.orm-entity';
import { TypeOrmSaleRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-sale.repository';
import { TypeOrmSalePaymentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-sale-payment.repository';
import {
  SALE_REPOSITORY_TOKEN,
  SALE_READ_REPOSITORY_TOKEN,
  SALE_WRITE_REPOSITORY_TOKEN,
} from './domain/repositories/sale.repository.interface';
import {
  SALE_PAYMENT_REPOSITORY_TOKEN,
  SALE_PAYMENT_READ_REPOSITORY_TOKEN,
  SALE_PAYMENT_WRITE_REPOSITORY_TOKEN,
} from './domain/repositories/sale-payment.repository.interface';

import {
  SalesController,
  SalesReportsController,
  SalesPaymentsController,
} from './presentation/http/controllers';
import { SALE_INVENTORY_PORT_TOKEN } from './application/ports';
import { InventoryStockAdapter } from './infrastructure/adapters';

import { CreateSaleUseCase } from './application/commands/create-sale/create-sale.use-case';
import { UpdateSaleUseCase } from './application/commands/update-sale/update-sale.use-case';
import { UpdateSaleStatusUseCase } from './application/commands/update-sale-status/update-sale-status.use-case';
import { UpdateSalePaidStatusUseCase } from './application/commands/update-sale-paid-status/update-sale-paid-status.use-case';
import { ConvertQuotationUseCase } from './application/commands/convert-quotation/convert-quotation.use-case';
import { DeleteSaleUseCase } from './application/commands/delete-sale/delete-sale.use-case';
import { CreateSalePaymentUseCase } from './application/commands/create-sale-payment/create-sale-payment.use-case';
import { CloseSaleManuallyUseCase } from './application/commands/close-sale-manually/close-sale-manually.use-case';
import { CancelSalePaymentUseCase } from './application/commands/cancel-sale-payment/cancel-sale-payment.use-case';

import { FindSalesUseCase } from './application/queries/find-sales/find-sales.use-case';
import { FindSaleByIdUseCase } from './application/queries/find-sale-by-id/find-sale-by-id.use-case';
import { FindSaleStatsUseCase } from './application/queries/find-sale-stats/find-sale-stats.use-case';
import { FindSalePaymentsUseCase } from './application/queries/find-sale-payments/find-sale-payments.use-case';
import { FindSalePaymentByIdUseCase } from './application/queries/find-sale-payment-by-id/find-sale-payment-by-id.use-case';
import { FindPendingSalesByCustomerUseCase } from './application/queries/find-pending-sales-by-customer/find-pending-sales-by-customer.use-case';
import { FindPaymentsBySaleIdUseCase } from './application/queries/find-payments-by-sale-id/find-payments-by-sale-id.use-case';

import {
  SaleItemsService,
  SaleCompletionService,
} from './application/services';

import { SaleCompletedListener } from './application/events/sale-completed.listener';
import { SaleCancelledListener } from './application/events/sale-cancelled.listener';
import { SalePaymentStatusChangedListener } from './application/events/sale-payment-status-changed.listener';

import { SalesPdfService } from './infrastructure/reports/sales-pdf.service';
import { SalesExportService } from './infrastructure/reports/sales-export.service';

import { ProductsModule } from '@/catalog/products/products.module';
import { RecipesModule } from '@/catalog/recipes/recipes.module';
import { InventoryStocksModule } from '@/inventory/stocks/inventory-stocks.module';
import { WarehousesModule } from '@/inventory/warehouses/warehouses.module';

const UseCases = [
  CreateSaleUseCase,
  UpdateSaleUseCase,
  UpdateSaleStatusUseCase,
  UpdateSalePaidStatusUseCase,
  ConvertQuotationUseCase,
  DeleteSaleUseCase,
  CreateSalePaymentUseCase,
  CloseSaleManuallyUseCase,
  CancelSalePaymentUseCase,
  FindSalesUseCase,
  FindSaleByIdUseCase,
  FindSaleStatsUseCase,
  FindSalePaymentsUseCase,
  FindSalePaymentByIdUseCase,
  FindPendingSalesByCustomerUseCase,
  FindPaymentsBySaleIdUseCase,
];

const Services = [
  SaleItemsService,
  SaleCompletionService,
  SalesPdfService,
  SalesExportService,
];

const EventListeners = [
  SaleCompletedListener,
  SaleCancelledListener,
  SalePaymentStatusChangedListener,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      SaleOrmEntity,
      SaleItemOrmEntity,
      SalePaymentOrmEntity,
      SalePaymentAllocationOrmEntity,
    ]),
    ProductsModule,
    RecipesModule,
    InventoryStocksModule,
    WarehousesModule,
  ],
  controllers: [
    SalesPaymentsController,
    SalesReportsController,
    SalesController,
  ],
  providers: [
    ...UseCases,
    ...Services,
    ...EventListeners,
    {
      provide: SALE_REPOSITORY_TOKEN,
      useClass: TypeOrmSaleRepository,
    },
    {
      provide: SALE_READ_REPOSITORY_TOKEN,
      useExisting: SALE_REPOSITORY_TOKEN,
    },
    {
      provide: SALE_WRITE_REPOSITORY_TOKEN,
      useExisting: SALE_REPOSITORY_TOKEN,
    },
    TypeOrmSalePaymentRepository,
    {
      provide: SALE_PAYMENT_REPOSITORY_TOKEN,
      useClass: TypeOrmSalePaymentRepository,
    },
    {
      provide: SALE_PAYMENT_READ_REPOSITORY_TOKEN,
      useExisting: SALE_PAYMENT_REPOSITORY_TOKEN,
    },
    {
      provide: SALE_PAYMENT_WRITE_REPOSITORY_TOKEN,
      useExisting: SALE_PAYMENT_REPOSITORY_TOKEN,
    },
    {
      provide: SALE_INVENTORY_PORT_TOKEN,
      useClass: InventoryStockAdapter,
    },
  ],
  exports: [
    SALE_REPOSITORY_TOKEN,
    SALE_READ_REPOSITORY_TOKEN,
    SALE_WRITE_REPOSITORY_TOKEN,
    SALE_PAYMENT_REPOSITORY_TOKEN,
    SALE_PAYMENT_READ_REPOSITORY_TOKEN,
    SALE_PAYMENT_WRITE_REPOSITORY_TOKEN,
    ...UseCases,
    ...Services,
  ],
})
export class SalesModule {}
