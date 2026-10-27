import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleItem } from '@/sales/domain/entities/sale-item.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

export interface SaleCurrencyContext {
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;
}

export interface SaleCommandPayload {
  id?: string;
  saleNumber?: string;
  saleType?: SaleType;
  paymentTerm?: SalePaymentTerm;
  dueDate?: Date | string | null;
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
  saleDate?: Date | string;
  validUntil?: Date | string | null;
  exchangeRate?: number;
  functionalCurrency?: string;
  localCurrency?: string;
  documentCurrency?: string;
  convertedFromQuotationId?: string | null;
  warehouseId?: string | null;
  createdById?: string | null;
}

export class SaleCommandMapper {
  static resolveCurrencies(params: {
    exchangeRate?: number;
    functionalCurrency?: string;
    localCurrency?: string;
    documentCurrency?: string;
  }): SaleCurrencyContext {
    const exchangeRate =
      params.exchangeRate !== undefined && Number(params.exchangeRate) > 0
        ? Number(params.exchangeRate)
        : 1.0;
    const functionalCurrency = params.functionalCurrency || 'USD';
    const localCurrency = params.localCurrency || 'VES';
    const documentCurrency = params.documentCurrency || 'USD';

    return {
      exchangeRate,
      functionalCurrency,
      localCurrency,
      documentCurrency,
    };
  }

  static toDomain(command: SaleCommandPayload, items: SaleItem[] = []): Sale {
    const currencies = this.resolveCurrencies(command);

    const sale = new Sale({
      id: command.id,
      saleNumber: command.saleNumber,
      saleType: command.saleType || SaleType.DIRECT_SALE,
      paymentTerm: command.paymentTerm || SalePaymentTerm.CONTADO,
      dueDate: command.dueDate ? new Date(command.dueDate) : null,
      paidStatus: command.paidStatus || SalePaidStatus.PENDIENTE,
      status: command.status || SaleStatus.DRAFT,
      customerName: command.customerName?.trim() || 'Consumidor Final',
      customerTaxId: command.customerTaxId?.trim() || null,
      customerEmail: command.customerEmail?.trim() || null,
      customerPhone: command.customerPhone?.trim() || null,
      customerAddress: command.customerAddress?.trim() || null,
      notes: command.notes?.trim() || null,
      paymentMethod: command.paymentMethod || PaymentMethod.CASH,
      paymentNotes: command.paymentNotes?.trim() || null,
      saleDate: command.saleDate ? new Date(command.saleDate) : new Date(),
      validUntil: command.validUntil ? new Date(command.validUntil) : null,
      warehouseId: command.warehouseId || null,
      convertedFromQuotationId: command.convertedFromQuotationId || null,
      createdById:
        typeof command.createdById === 'string'
          ? command.createdById
          : undefined,
      ...currencies,
      items,
    });

    sale.calculateTotals();
    return sale;
  }

  static fromCommand(
    command: SaleCommandPayload,
    items: SaleItem[] = [],
  ): Sale {
    return SaleCommandMapper.toDomain(command, items);
  }
}
