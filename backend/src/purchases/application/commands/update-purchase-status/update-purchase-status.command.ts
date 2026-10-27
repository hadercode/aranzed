import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export class UpdatePurchaseStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: PurchaseStatus,
  ) {}
}
