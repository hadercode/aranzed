import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdjustmentsReportQuery } from './get-adjustments-report.query';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';
import { InventoryAdjustmentReportOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/inventory-adjustment-report.orm-entity';

@QueryHandler(GetAdjustmentsReportQuery)
export class GetAdjustmentsReportHandler
  implements IQueryHandler<GetAdjustmentsReportQuery>
{
  constructor(private readonly stocksService: InventoryStocksService) {}

  async execute(
    _query: GetAdjustmentsReportQuery,
  ): Promise<InventoryAdjustmentReportOrmEntity[]> {
    return this.stocksService.getAdjustmentsReport();
  }
}

