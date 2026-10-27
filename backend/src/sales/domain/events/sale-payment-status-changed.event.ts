export class SalePaymentStatusChangedEvent {
  constructor(
    public readonly saleId: string,
    public readonly saleNumber: string,
    public readonly previousPaidStatus: string,
    public readonly newPaidStatus: string,
    public readonly paymentTerm: string,
    public readonly dueDate: Date | null,
    public readonly customerName: string,
    public readonly customerTaxId: string | null,
    public readonly total: number,
    public readonly totalLocal: number,
    public readonly functionalCurrency: string,
    public readonly localCurrency: string,
    public readonly exchangeRate: number,
    public readonly occurredAt: Date = new Date(),
    public readonly userId?: string | null,
  ) {}
}
