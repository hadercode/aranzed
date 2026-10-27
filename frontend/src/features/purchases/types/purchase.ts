export type PurchaseStatus = 'DRAFT' | 'COMPLETED' | 'CANCELLED';

export interface PurchaseMaterialSummary {
  id: string;
  name: string;
  type: string;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
}

export interface PurchaseItem {
  id?: string;
  purchaseId?: string;
  materialId: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitCostLocal?: number;
  currencySymbolFunctional?: string;
  currencySymbolLocal?: string;
  isTaxable: boolean;
  taxRate: number;
  taxAmount: number;
  taxAmountLocal?: number;
  subtotal: number;
  subtotalLocal?: number;
  total: number;
  totalLocal?: number;
  sortOrder: number;
  batchNumber?: string | null;
  expiryDate?: string | null;
  material?: PurchaseMaterialSummary | null;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: string;
  description?: string | null;
  status: PurchaseStatus;
  invoiceNumber: string;
  warehouseId?: string | null;

  // Bimoneda y Tasa
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency?: string;

  // Totales en Moneda Funcional
  subtotal: number;
  taxAmount: number;
  total: number;

  // Totales en Moneda Local
  subtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  items: PurchaseItem[];
}

export interface PurchaseFilters {
  search?: string;
  status?: PurchaseStatus | 'ALL';
  supplierName?: string;
  startDate?: string;
  endDate?: string;
}

export interface PurchaseStats {
  totalCount: number;
  completedCount: number;
  draftCount: number;
  cancelledCount: number;
  totalInvested: number;
  averageTicket: number;
}
