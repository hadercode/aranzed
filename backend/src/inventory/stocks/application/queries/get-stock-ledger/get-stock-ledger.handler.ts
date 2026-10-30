import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStockLedgerQuery } from './get-stock-ledger.query';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';

@QueryHandler(GetStockLedgerQuery)
export class GetStockLedgerHandler
  implements IQueryHandler<GetStockLedgerQuery>
{
  constructor(private readonly stocksService: InventoryStocksService) {}

  async execute(query: GetStockLedgerQuery): Promise<any[]> {
    return this.stocksService.findLedger(query.filters);
  }
}

