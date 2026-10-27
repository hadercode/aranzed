export interface SaleCancelledEventItem {
  productId: string;
  quantity: number;
}

export class SaleCancelledEvent {
  constructor(
    public readonly saleId: string,
    public readonly saleNumber: string,
    public readonly reason?: string,
    public readonly items: SaleCancelledEventItem[] = [],
    public readonly cancelledById?: string | null,
  ) {}
}
