import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export interface UpdatePurchaseItemCommand {
  id?: string;
  materialId: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitCostLocal?: number;
  currencySymbolFunctional?: string;
  currencySymbolLocal?: string;
  isTaxable?: boolean;
  taxRate?: number;
  sortOrder?: number;
  batchNumber?: string;
  expiryDate?: string;
}

export class UpdatePurchaseCommand {
  id: string;
  supplierName: string;
  purchaseDate: Date;
  description?: string;
  status?: PurchaseStatus;
  invoiceNumber: string;
  warehouseId?: string;
  exchangeRate?: number;
  functionalCurrency?: string;
  localCurrency?: string;
  documentCurrency?: string;
  items: UpdatePurchaseItemCommand[];

  constructor(
    partial: Omit<Partial<UpdatePurchaseCommand>, 'purchaseDate'> & {
      purchaseDate?: Date | string;
    },
  ) {
    Object.assign(this, partial);
    if (partial.purchaseDate) {
      this.purchaseDate =
        partial.purchaseDate instanceof Date
          ? partial.purchaseDate
          : new Date(partial.purchaseDate);
    }
  }

  static fromDto(
    id: string,
    dto: Omit<Partial<UpdatePurchaseCommand>, 'id' | 'purchaseDate'> & {
      purchaseDate?: Date | string;
    },
  ): UpdatePurchaseCommand {
    return new UpdatePurchaseCommand({
      ...dto,
      id,
    });
  }
}
