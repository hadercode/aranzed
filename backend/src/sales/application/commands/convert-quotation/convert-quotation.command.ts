import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';

export class ConvertQuotationCommand {
  constructor(
    public readonly quotationId: string,
    public readonly targetStatus: SaleStatus = SaleStatus.COMPLETED,
    public readonly userId?: string,
  ) {}
}
