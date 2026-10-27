import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import { SalePaymentAllocation } from '@/sales/domain/entities/sale-payment-allocation.entity';
import { SalePaymentOrmEntity } from '../entities/sale-payment.orm-entity';
import { SalePaymentAllocationOrmEntity } from '../entities/sale-payment-allocation.orm-entity';
import { SaleOrmMapper } from './sale.orm-mapper';

export class SalePaymentOrmMapper {
  static toDomain(orm: SalePaymentOrmEntity): SalePayment {
    const allocations = (orm.allocations || []).map((a) => {
      const alloc = new SalePaymentAllocation({
        id: a.id,
        paymentId: a.paymentId,
        saleId: a.saleId,
        amountAllocated: Number(a.amountAllocated),
        amountAllocatedLocal: Number(a.amountAllocatedLocal),
        differenceAdjustment: Number(a.differenceAdjustment),
        notes: a.notes,
        sale: a.sale ? SaleOrmMapper.toDomain(a.sale) : undefined,
      });
      alloc.createdAt = a.createdAt;
      return alloc;
    });

    const payment = new SalePayment({
      id: orm.id,
      paymentNumber: orm.paymentNumber,
      customerName: orm.customerName,
      customerTaxId: orm.customerTaxId,
      paymentDate: orm.paymentDate,
      paymentMethod: orm.paymentMethod,
      reference: orm.reference,
      amount: Number(orm.amount),
      amountLocal: Number(orm.amountLocal),
      exchangeRate: Number(orm.exchangeRate),
      currency: orm.currency,
      receiptUrl: orm.receiptUrl,
      notes: orm.notes,
      status: orm.status,
      createdById: orm.createdById,
      allocations,
    });

    payment.createdAt = orm.createdAt;
    payment.updatedAt = orm.updatedAt;
    payment.deletedAt = orm.deletedAt || null;

    return payment;
  }

  static toDomainList(orms: SalePaymentOrmEntity[]): SalePayment[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm));
  }

  static toOrm(domain: SalePayment): SalePaymentOrmEntity {
    const orm = new SalePaymentOrmEntity();
    orm.id = domain.id;
    orm.paymentNumber = domain.paymentNumber;
    orm.customerName = domain.customerName;
    orm.customerTaxId = domain.customerTaxId || null;
    orm.paymentDate = domain.paymentDate;
    orm.paymentMethod = domain.paymentMethod;
    orm.reference = domain.reference || null;
    orm.amount = domain.amount;
    orm.amountLocal = domain.amountLocal;
    orm.exchangeRate = domain.exchangeRate;
    orm.currency = domain.currency;
    orm.receiptUrl = domain.receiptUrl || null;
    orm.notes = domain.notes || null;
    orm.status = domain.status;
    orm.createdById = domain.createdById || null;

    if (domain.allocations && domain.allocations.length > 0) {
      orm.allocations = domain.allocations.map((a) => {
        const aOrm = new SalePaymentAllocationOrmEntity();
        aOrm.id = a.id;
        aOrm.paymentId = domain.id;
        aOrm.saleId = a.saleId;
        aOrm.amountAllocated = a.amountAllocated;
        aOrm.amountAllocatedLocal = a.amountAllocatedLocal;
        aOrm.differenceAdjustment = a.differenceAdjustment;
        aOrm.notes = a.notes || null;
        return aOrm;
      });
    } else {
      orm.allocations = [];
    }

    return orm;
  }
}
