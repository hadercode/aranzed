import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export interface CreatePurchaseItemCommand {
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

export class CreatePurchaseCommand {
  purchaseNumber?: string;
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
  items: CreatePurchaseItemCommand[];
  createdById?: string;

  constructor(
    partial: Omit<Partial<CreatePurchaseCommand>, 'purchaseDate'> & {
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
    dto: Omit<Partial<CreatePurchaseCommand>, 'purchaseDate'> & {
      purchaseDate?: Date | string;
    },
    createdById?: string,
  ): CreatePurchaseCommand {
    return new CreatePurchaseCommand({
      ...dto,
      createdById,
    });
  }
}
