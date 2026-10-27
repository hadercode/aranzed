export type SaleType = 'QUOTATION' | 'DIRECT_SALE';
export type SalePaymentTerm = 'CONTADO' | 'CREDITO';
export type SalePaidStatus = 'PENDIENTE' | 'ABONADO' | 'PAGADO';
export type SaleStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD' | 'CREDIT' | 'OTHER';
export type PaymentStatus = 'CONFIRMED' | 'CANCELLED';

export interface SaleItemProductSummary {
  id: string;
  name: string;
  type: string;
  uomCode?: string;
  uomName?: string;
  imageUrl?: string | null;
  lastCost: number;
  lastSalePrice: number;
}

export interface SaleItem {
  id?: string;
  saleId?: string;
  productId: string;
  description: string;
  productType?: string;
  quantity: number;
  unitPrice: number;
  unitCost?: number;
  discountRate: number;
  discountAmount?: number;
  isTaxable: boolean;
  taxRate: number;
  taxAmount?: number;
  subtotal: number;
  total: number;
  unitPriceLocal?: number;
  subtotalLocal?: number;
  discountAmountLocal?: number;
  taxAmountLocal?: number;
  totalLocal?: number;
  currencySymbolFunctional?: string;
  currencySymbolLocal?: string;
  sortOrder?: number;
  product?: SaleItemProductSummary | null;
}

export interface Sale {
  id: string;
  saleNumber: string;
  saleType: SaleType;
  paymentTerm: SalePaymentTerm;
  dueDate?: string | null;
  paidStatus: SalePaidStatus;
  status: SaleStatus;
  customerName: string;
  customerTaxId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  paymentMethod?: PaymentMethod;
  paymentNotes?: string | null;
  saleDate: string;
  validUntil?: string | null;

  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency?: string;

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;

  subtotalLocal: number;
  discountAmountLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  paidAmount: number;
  paidAmountLocal: number;
  balance: number;
  balanceLocal: number;

  convertedFromQuotationId?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  items: SaleItem[];
}

export interface SaleFilters {
  search?: string;
  saleType?: SaleType | 'ALL';
  paymentTerm?: SalePaymentTerm | 'ALL';
  paidStatus?: SalePaidStatus | 'ALL';
  status?: SaleStatus | 'ALL';
  customerName?: string;
  startDate?: string;
  endDate?: string;
}

export interface SaleStats {
  totalSalesCount: number;
  totalQuotationsCount: number;
  completedSalesCount: number;
  draftCount: number;
  cancelledCount: number;
  totalRevenueUSD: number;
  totalRevenueLocal: number;
  averageTicketUSD: number;
}

export interface SalePaymentAllocation {
  id: string;
  paymentId: string;
  saleId: string;
  saleNumber?: string;
  amountAllocated: number;
  amountAllocatedLocal: number;
  differenceAdjustment: number;
  notes?: string | null;
  createdAt: string;
}

export interface SalePayment {
  id: string;
  paymentNumber: string;
  customerName: string;
  customerTaxId?: string | null;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference?: string | null;
  amount: number;
  amountLocal: number;
  exchangeRate: number;
  currency: string;
  receiptUrl?: string | null;
  notes?: string | null;
  status: PaymentStatus;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  createdById?: string | null;
  createdAt?: string;
  updatedAt?: string;
  allocations: SalePaymentAllocation[];
}

export interface PendingSaleForPayment {
  id: string;
  saleNumber: string;
  customerName: string;
  customerTaxId?: string | null;
  saleDate: string;
  dueDate?: string | null;
  paymentTerm: string;
  status: string;
  paidStatus: string;
  total: number;
  totalLocal: number;
  paidAmount: number;
  paidAmountLocal: number;
  balance: number;
  balanceLocal: number;
  exchangeRate: number;
}

export interface CreateSalePaymentAllocationPayload {
  saleId: string;
  amountAllocated: number;
  amountAllocatedLocal?: number;
  differenceAdjustment?: number;
  notes?: string;
}

export interface CreateSalePaymentPayload {
  customerName: string;
  customerTaxId?: string;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  amount: number;
  amountLocal?: number;
  exchangeRate?: number;
  currency?: string;
  receiptUrl?: string;
  notes?: string;
  allocations: CreateSalePaymentAllocationPayload[];
}

export interface CloseSaleManuallyPayload {
  differenceAdjustment?: number;
  reason?: string;
}

export interface SalePaymentFilters {
  search?: string;
  customerName?: string;
  paymentMethod?: PaymentMethod | 'ALL';
  status?: PaymentStatus | 'ALL';
  startDate?: string;
  endDate?: string;
}
