import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

export class UpdateSalePaidStatusCommand {
  constructor(
    public readonly id: string,
    public readonly paidStatus: SalePaidStatus,
    public readonly userId?: string,
  ) {}
}
