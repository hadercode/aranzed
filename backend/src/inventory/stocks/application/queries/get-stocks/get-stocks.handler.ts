import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStocksQuery } from './get-stocks.query';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';

@QueryHandler(GetStocksQuery)
export class GetStocksHandler implements IQueryHandler<GetStocksQuery> {
  constructor(private readonly stocksService: InventoryStocksService) {}

  async execute(query: GetStocksQuery): Promise<any[]> {
    return this.stocksService.findAll(query.filters);
  }
}

