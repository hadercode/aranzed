import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import { CreateSaleItemDtoInput } from '../create-sale/create-sale.command';

export type UpdateSaleCommandInput = Omit<
  Partial<UpdateSaleCommand>,
  'dueDate' | 'saleDate' | 'validUntil'
> & {
  dueDate?: Date | string | null;
  saleDate?: Date | string;
  validUntil?: Date | string | null;
};

export class UpdateSaleCommand {
  id: string;
  saleType?: SaleType;
  paymentTerm?: SalePaymentTerm;
  dueDate?: Date | null;
  paidStatus?: SalePaidStatus;
  status?: SaleStatus;
  customerName?: string;
  customerTaxId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  paymentMethod?: PaymentMethod;
  paymentNotes?: string | null;
  saleDate?: Date;
  validUntil?: Date | null;
  exchangeRate?: number;
  functionalCurrency?: string;
  localCurrency?: string;
  documentCurrency?: string;
  items?: CreateSaleItemDtoInput[];
  warehouseId?: string | null;
  userId?: string | null;

  constructor(
    idOrPartial: string | UpdateSaleCommandInput,
    saleType?: SaleType,
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
    userId?: string,
  ) {
    if (typeof idOrPartial === 'object' && idOrPartial !== null) {
      Object.assign(this, idOrPartial);
      this.id = idOrPartial.id!;
      if (idOrPartial.dueDate) this.dueDate = new Date(idOrPartial.dueDate);
      if (idOrPartial.saleDate) this.saleDate = new Date(idOrPartial.saleDate);
      if (idOrPartial.validUntil)
        this.validUntil = new Date(idOrPartial.validUntil);
    } else {
      this.id = idOrPartial;
      this.saleType = saleType;
      this.paymentTerm = paymentTerm;
      this.dueDate = dueDate ? new Date(dueDate) : null;
      this.paidStatus = paidStatus;
      this.status = status;
      this.customerName = customerName;
      this.customerTaxId = customerTaxId || null;
      this.customerEmail = customerEmail || null;
      this.customerPhone = customerPhone || null;
      this.customerAddress = customerAddress || null;
      this.notes = notes || null;
      this.paymentMethod = paymentMethod;
      this.paymentNotes = paymentNotes || null;
      this.saleDate = saleDate ? new Date(saleDate) : undefined;
      this.validUntil = validUntil ? new Date(validUntil) : null;
      this.exchangeRate = exchangeRate;
      this.functionalCurrency = functionalCurrency;
      this.localCurrency = localCurrency;
      this.documentCurrency = documentCurrency;
      this.items = items;
      this.userId = userId || null;
    }
  }

  static fromDto(
    id: string,
    dto: UpdateSaleCommandInput,
    userId?: string,
  ): UpdateSaleCommand {
    return new UpdateSaleCommand({
      ...dto,
      id,
      userId,
    });
  }
}
