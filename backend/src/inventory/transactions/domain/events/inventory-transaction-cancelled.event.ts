export class InventoryTransactionCancelledEvent {
  constructor(
    public readonly transactionId: string,
    public readonly transactionNumber: string,
    public readonly userId?: string | null,
    public readonly reason?: string | null,
  ) {}
}
