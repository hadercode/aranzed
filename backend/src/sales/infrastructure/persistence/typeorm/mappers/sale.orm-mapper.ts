import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleOrmEntity } from '../entities/sale.orm-entity';
import { SaleItemOrmMapper } from './sale-item.orm-mapper';

export class SaleOrmMapper {
  static toDomain(orm: SaleOrmEntity): Sale {
    const exchangeRate = Number(orm.exchangeRate) || 1.0;
    const items = SaleItemOrmMapper.toDomainList(orm.items || [], exchangeRate);

    const sale = new Sale({
      id: orm.id,
      saleNumber: orm.saleNumber,
      saleType: orm.saleType,
      paymentTerm: orm.paymentTerm,
      dueDate: orm.dueDate,
      paidStatus: orm.paidStatus,
      status: orm.status,
      customerName: orm.customerName,
      customerTaxId: orm.customerTaxId,
      customerEmail: orm.customerEmail,
      customerPhone: orm.customerPhone,
      customerAddress: orm.customerAddress,
      notes: orm.notes,
      paymentMethod: orm.paymentMethod,
      paymentNotes: orm.paymentNotes,
      saleDate: orm.saleDate,
      validUntil: orm.validUntil,
      exchangeRate,
      functionalCurrency: orm.functionalCurrency,
      localCurrency: orm.localCurrency,
      documentCurrency: orm.documentCurrency,
      subtotal: Number(orm.subtotal),
      discountAmount: Number(orm.discountAmount),
      taxAmount: Number(orm.taxAmount),
      total: Number(orm.total),
      subtotalLocal: Number(orm.subtotalLocal),
      discountAmountLocal: Number(orm.discountAmountLocal),
      taxAmountLocal: Number(orm.taxAmountLocal),
      totalLocal: Number(orm.totalLocal),
      paidAmount: Number(orm.paidAmount || 0),
      paidAmountLocal: Number(orm.paidAmountLocal || 0),
      convertedFromQuotationId: orm.convertedFromQuotationId,
      createdById: orm.createdById,
      items,
    });

    sale.createdAt = orm.createdAt;
    sale.updatedAt = orm.updatedAt;
    sale.deletedAt = orm.deletedAt || null;

    return sale;
  }

  static toDomainList(orms: SaleOrmEntity[]): Sale[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm));
  }

  static toOrm(domain: Sale): SaleOrmEntity {
    const orm = new SaleOrmEntity();
    Object.assign(orm, {
      id: domain.id,
      saleNumber: domain.saleNumber,
      saleType: domain.saleType,
      paymentTerm: domain.paymentTerm,
      dueDate: domain.dueDate || null,
      paidStatus: domain.paidStatus,
      status: domain.status,
      customerName: domain.customerName,
      customerTaxId: domain.customerTaxId || null,
      customerEmail: domain.customerEmail || null,
      customerPhone: domain.customerPhone || null,
      customerAddress: domain.customerAddress || null,
      notes: domain.notes || null,
      paymentMethod: domain.paymentMethod,
      paymentNotes: domain.paymentNotes || null,
      saleDate: domain.saleDate,
      validUntil: domain.validUntil || null,
      exchangeRate: domain.exchangeRate,
      functionalCurrency: domain.functionalCurrency,
      localCurrency: domain.localCurrency,
      documentCurrency: domain.documentCurrency,
      subtotal: domain.subtotal,
      discountAmount: domain.discountAmount,
      taxAmount: domain.taxAmount,
      total: domain.total,
      subtotalLocal: domain.subtotalLocal,
      discountAmountLocal: domain.discountAmountLocal,
      taxAmountLocal: domain.taxAmountLocal,
      totalLocal: domain.totalLocal,
      paidAmount: domain.paidAmount,
      paidAmountLocal: domain.paidAmountLocal,
      convertedFromQuotationId: domain.convertedFromQuotationId || null,
      createdById: domain.createdById || null,
      items: domain.items?.length
        ? SaleItemOrmMapper.toOrmList(domain.items, domain.id)
        : [],
    });
    return orm;
  }

  static toOrmList(domains: Sale[]): SaleOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain) => this.toOrm(domain));
  }
}

export const SaleMapper = SaleOrmMapper;
