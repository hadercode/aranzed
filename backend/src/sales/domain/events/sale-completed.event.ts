export interface SaleCompletedEventItem {
  productId: string;
  sku?: string;
  name?: string;
  uomSymbol?: string;
  description: string;
  productType: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  subtotal: number;
  total: number;
}

export class SaleCompletedEvent {
  constructor(
    public readonly saleId: string,
    public readonly saleNumber: string,
    public readonly saleType: string,
    public readonly customerName: string,
    public readonly saleDate: Date,
    public readonly exchangeRate: number,
    public readonly functionalCurrency: string,
    public readonly localCurrency: string,
    public readonly documentCurrency: string,
    public readonly items: SaleCompletedEventItem[],
    public readonly subtotal: number,
    public readonly subtotalLocal: number,
    public readonly taxAmount: number,
    public readonly taxAmountLocal: number,
    public readonly total: number,
    public readonly totalLocal: number,
    public readonly createdById?: string | null,
    public readonly warehouseId?: string | null,
  ) {}
}
