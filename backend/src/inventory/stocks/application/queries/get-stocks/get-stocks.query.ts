import { StockFiltersDto } from '@/inventory/stocks/presentation/http/dto/stock-filters.dto';

export class GetStocksQuery {
  constructor(public readonly filters: StockFiltersDto) {}
}

