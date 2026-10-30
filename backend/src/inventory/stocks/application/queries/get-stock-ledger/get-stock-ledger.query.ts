export interface StockLedgerFilters {
  stockId?: string;
  transactionItemId?: string;
}

export class GetStockLedgerQuery {
  constructor(public readonly filters?: StockLedgerFilters) {}
}

