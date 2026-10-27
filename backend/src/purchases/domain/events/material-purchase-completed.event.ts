import { DomainEvent } from '@/core/domain/domain-event';
import { IEvent } from '@nestjs/cqrs';
import { PurchaseStatus } from '../enums/purchase-status.enum';

export interface PurchaseCompletedItemPayload {
  materialId: string;
  sku?: string;
  name?: string;
  uomSymbol?: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitCostLocal: number;
  batchNumber?: string | null;
  expiryDate?: Date | null;
  isTaxable: boolean;
  taxRate: number;
  taxAmount: number;
  taxAmountLocal: number;
  subtotal: number;
  subtotalLocal: number;
  total: number;
  totalLocal: number;
  currencySymbolFunctional: string;
  currencySymbolLocal: string;
}

export class MaterialPurchaseCompletedEvent
  extends DomainEvent
  implements IEvent
{
  constructor(
    public readonly purchaseId: string,
    public readonly purchaseNumber: string,
    public readonly supplierName: string,
    public readonly invoiceNumber: string,
    public readonly purchaseDate: Date,
    public readonly status: PurchaseStatus,
    public readonly exchangeRate: number,
    public readonly functionalCurrency: string,
    public readonly localCurrency: string,
    public readonly documentCurrency: string,
    public readonly items: PurchaseCompletedItemPayload[],
    public readonly subtotal: number,
    public readonly subtotalLocal: number,
    public readonly taxAmount: number,
    public readonly taxAmountLocal: number,
    public readonly total: number,
    public readonly totalLocal: number,
    public readonly createdById?: string | null,
    public readonly warehouseId?: string | null,
  ) {
    super(MaterialPurchaseCompletedEvent.name);
  }
}
