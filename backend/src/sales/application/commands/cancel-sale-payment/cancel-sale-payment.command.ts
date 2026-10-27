export class CancelSalePaymentCommand {
  constructor(
    public readonly paymentId: string,
    public readonly reason?: string,
    public readonly userId?: string,
  ) {}
}
