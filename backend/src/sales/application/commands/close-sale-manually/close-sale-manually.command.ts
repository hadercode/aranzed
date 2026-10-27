export interface CloseSaleManuallyInput {
  differenceAdjustment?: number;
  reason?: string;
}

export class CloseSaleManuallyCommand {
  constructor(
    public readonly saleId: string,
    public readonly differenceAdjustment: number,
    public readonly reason?: string,
    public readonly userId?: string,
  ) {}

  static fromDto(
    saleId: string,
    dto: CloseSaleManuallyInput,
    userId?: string,
  ): CloseSaleManuallyCommand {
    return new CloseSaleManuallyCommand(
      saleId,
      Number(dto.differenceAdjustment || 0),
      dto.reason,
      userId,
    );
  }
}
