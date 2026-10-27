import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';

export class UpdateSaleStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: SaleStatus,
    public readonly cancelReason?: string,
    public readonly userId?: string,
  ) {}
}
