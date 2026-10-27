import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

export interface CreateSaleItemDtoInput {
  productId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountRate?: number;
  isTaxable?: boolean;
  taxRate?: number;
  sortOrder?: number;
}

export type CreateSaleCommandInput = Omit<
  Partial<CreateSaleCommand>,
  'dueDate' | 'saleDate' | 'validUntil'
> & {
  dueDate?: Date | string | null;
  saleDate?: Date | string;
  validUntil?: Date | string | null;
};

export class CreateSaleCommand {
  saleType: SaleType;
  paymentTerm: SalePaymentTerm;
  dueDate?: Date | null;
  paidStatus: SalePaidStatus;
  status: SaleStatus;
  customerName: string;
  customerTaxId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  paymentMethod: PaymentMethod;
  paymentNotes?: string | null;
  saleDate: Date;
  validUntil?: Date | null;
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;
  items: CreateSaleItemDtoInput[];
  saleNumber?: string;
  warehouseId?: string | null;
  createdById?: string | null;

  constructor(
    partialOrSaleType?: CreateSaleCommandInput | SaleType,
    paymentTerm?: SalePaymentTerm,
    dueDate?: Date | string | null,
    paidStatus?: SalePaidStatus,
    status?: SaleStatus,
    customerName?: string,
    customerTaxId?: string,
    customerEmail?: string,
    customerPhone?: string,
    customerAddress?: string,
    notes?: string,
    paymentMethod?: PaymentMethod,
    paymentNotes?: string,
    saleDate?: Date | string,
    validUntil?: Date | string,
    exchangeRate?: number,
    functionalCurrency?: string,
    localCurrency?: string,
    documentCurrency?: string,
    items?: CreateSaleItemDtoInput[],
    saleNumber?: string,
    createdById?: string,
  ) {
    if (typeof partialOrSaleType === 'object' && partialOrSaleType !== null) {
      Object.assign(this, partialOrSaleType);
      this.saleType = partialOrSaleType.saleType || SaleType.DIRECT_SALE;
      this.paymentTerm =
        partialOrSaleType.paymentTerm || SalePaymentTerm.CONTADO;
      this.paidStatus =
        partialOrSaleType.paidStatus || SalePaidStatus.PENDIENTE;
      this.status = partialOrSaleType.status || SaleStatus.DRAFT;
      this.customerName =
        partialOrSaleType.customerName?.trim() || 'Consumidor Final';
      this.paymentMethod =
        partialOrSaleType.paymentMethod || PaymentMethod.CASH;
      this.saleDate = partialOrSaleType.saleDate
        ? new Date(partialOrSaleType.saleDate)
        : new Date();
      this.dueDate = partialOrSaleType.dueDate
        ? new Date(partialOrSaleType.dueDate)
        : null;
      this.validUntil = partialOrSaleType.validUntil
        ? new Date(partialOrSaleType.validUntil)
        : null;
      this.exchangeRate = Number(partialOrSaleType.exchangeRate) || 1.0;
      this.functionalCurrency = partialOrSaleType.functionalCurrency || 'USD';
      this.localCurrency = partialOrSaleType.localCurrency || 'VES';
      this.documentCurrency = partialOrSaleType.documentCurrency || 'USD';
      this.items = partialOrSaleType.items || [];
      this.saleNumber = partialOrSaleType.saleNumber;
      this.warehouseId = partialOrSaleType.warehouseId || null;
      this.createdById = partialOrSaleType.createdById || null;
    } else {
      this.saleType = partialOrSaleType || SaleType.DIRECT_SALE;
      this.paymentTerm = paymentTerm || SalePaymentTerm.CONTADO;
      this.dueDate = dueDate ? new Date(dueDate) : null;
      this.paidStatus = paidStatus || SalePaidStatus.PENDIENTE;
      this.status = status || SaleStatus.DRAFT;
      this.customerName = customerName?.trim() || 'Consumidor Final';
      this.customerTaxId = customerTaxId || null;
      this.customerEmail = customerEmail || null;
      this.customerPhone = customerPhone || null;
      this.customerAddress = customerAddress || null;
      this.notes = notes || null;
      this.paymentMethod = paymentMethod || PaymentMethod.CASH;
      this.paymentNotes = paymentNotes || null;
      this.saleDate = saleDate ? new Date(saleDate) : new Date();
      this.validUntil = validUntil ? new Date(validUntil) : null;
      this.exchangeRate = Number(exchangeRate) || 1.0;
      this.functionalCurrency = functionalCurrency || 'USD';
      this.localCurrency = localCurrency || 'VES';
      this.documentCurrency = documentCurrency || 'USD';
      this.items = items || [];
      this.saleNumber = saleNumber;
      this.createdById = createdById || null;
    }
  }

  static fromDto(
    dto: CreateSaleCommandInput,
    createdById?: string,
  ): CreateSaleCommand {
    return new CreateSaleCommand({
      ...dto,
      createdById,
    });
  }
}
