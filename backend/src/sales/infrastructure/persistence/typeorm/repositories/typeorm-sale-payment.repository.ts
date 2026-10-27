import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import {
  ISalePaymentRepository,
  ISalePaymentReadRepository,
  ISalePaymentWriteRepository,
  FindSalePaymentsFilters,
} from '@/sales/domain/repositories/sale-payment.repository.interface';
import { SalePaymentOrmEntity } from '../entities/sale-payment.orm-entity';
import { SalePaymentAllocationOrmEntity } from '../entities/sale-payment-allocation.orm-entity';
import { SalePaymentOrmMapper } from '../mappers/sale-payment.orm-mapper';

@Injectable()
export class TypeOrmSalePaymentRepository
  implements
    ISalePaymentRepository,
    ISalePaymentReadRepository,
    ISalePaymentWriteRepository
{
  constructor(
    @InjectRepository(SalePaymentOrmEntity)
    private readonly paymentRepo: Repository<SalePaymentOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters?: FindSalePaymentsFilters,
  ): Promise<{ payments: SalePayment[]; total: number }> {
    const qb = this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.allocations', 'allocation')
      .leftJoinAndSelect('allocation.sale', 'sale')
      .where('payment.deletedAt IS NULL')
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC');

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(payment.customerName) LIKE :term OR LOWER(payment.paymentNumber) LIKE :term OR LOWER(payment.reference) LIKE :term OR LOWER(payment.notes) LIKE :term)',
        { term },
      );
    }

    if (filters?.customerName) {
      const term = `%${filters.customerName.toLowerCase()}%`;
      qb.andWhere('LOWER(payment.customerName) LIKE :cName', { cName: term });
    }

    if (filters?.paymentMethod) {
      qb.andWhere('payment.paymentMethod = :paymentMethod', {
        paymentMethod: filters.paymentMethod,
      });
    }

    if (filters?.status) {
      qb.andWhere('payment.status = :status', { status: filters.status });
    }

    if (filters?.startDate) {
      qb.andWhere('payment.paymentDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      qb.andWhere('payment.paymentDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const total = await qb.getCount();

    if (filters?.limit) {
      qb.take(filters.limit);
    }
    if (filters?.offset) {
      qb.skip(filters.offset);
    }

    const orms = await qb.getMany();
    return {
      payments: SalePaymentOrmMapper.toDomainList(orms),
      total,
    };
  }

  async findById(id: string): Promise<SalePayment | null> {
    const orm = await this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.allocations', 'allocation')
      .leftJoinAndSelect('allocation.sale', 'sale')
      .where('payment.id = :id', { id })
      .andWhere('payment.deletedAt IS NULL')
      .getOne();

    return orm ? SalePaymentOrmMapper.toDomain(orm) : null;
  }

  async findByPaymentNumber(
    paymentNumber: string,
  ): Promise<SalePayment | null> {
    const orm = await this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.allocations', 'allocation')
      .leftJoinAndSelect('allocation.sale', 'sale')
      .where('payment.paymentNumber = :paymentNumber', { paymentNumber })
      .andWhere('payment.deletedAt IS NULL')
      .getOne();

    return orm ? SalePaymentOrmMapper.toDomain(orm) : null;
  }

  async findBySaleId(saleId: string): Promise<SalePayment[]> {
    const orms = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.allocations', 'allocation')
      .leftJoinAndSelect('allocation.sale', 'sale')
      .where('allocation.saleId = :saleId', { saleId })
      .andWhere('payment.deletedAt IS NULL')
      .orderBy('payment.paymentDate', 'DESC')
      .getMany();

    return SalePaymentOrmMapper.toDomainList(orms);
  }

  async save(payment: SalePayment): Promise<SalePayment> {
    await this.dataSource.transaction(async (manager) => {
      const paymentOrm = SalePaymentOrmMapper.toOrm(payment);
      await manager.save(SalePaymentOrmEntity, paymentOrm);

      // Sincronización atómica de asignaciones a ventas
      await manager.delete(SalePaymentAllocationOrmEntity, {
        paymentId: payment.id,
      });

      if (payment.allocations && payment.allocations.length > 0) {
        const allocOrms = payment.allocations.map((a) => {
          const aOrm = new SalePaymentAllocationOrmEntity();
          aOrm.id = a.id;
          aOrm.paymentId = payment.id;
          aOrm.saleId = a.saleId;
          aOrm.amountAllocated = a.amountAllocated;
          aOrm.amountAllocatedLocal = a.amountAllocatedLocal;
          aOrm.differenceAdjustment = a.differenceAdjustment;
          aOrm.notes = a.notes || null;
          return aOrm;
        });
        await manager.save(SalePaymentAllocationOrmEntity, allocOrms);
      }
    });

    const saved = await this.findById(payment.id);
    return saved || payment;
  }

  async getNextSequenceNumber(): Promise<string> {
    const prefix = 'COB-';
    const currentYear = new Date().getFullYear();

    const last = await this.paymentRepo
      .createQueryBuilder('p')
      .where('p.paymentNumber LIKE :prefix', {
        prefix: `${prefix}${currentYear}-%`,
      })
      .orderBy('p.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (last) {
      const parts = last.paymentNumber.split('-');
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          nextNumber = lastSeq + 1;
        }
      }
    }

    return `${prefix}${currentYear}-${String(nextNumber).padStart(5, '0')}`;
  }
}
