import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import {
  ISaleRepository,
  ISaleReadRepository,
  ISaleWriteRepository,
  FindSalesFilters,
  SaleStatsSummary,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleOrmEntity } from '../entities/sale.orm-entity';
import { SaleItemOrmEntity } from '../entities/sale-item.orm-entity';
import { SaleOrmMapper, SaleItemOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmSaleRepository
  implements ISaleRepository, ISaleReadRepository, ISaleWriteRepository
{
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly saleRepo: Repository<SaleOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters?: FindSalesFilters,
  ): Promise<{ sales: Sale[]; total: number }> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('product.uom', 'uom')
      .where('sale.deletedAt IS NULL')
      .orderBy('sale.saleDate', 'DESC')
      .addOrderBy('sale.createdAt', 'DESC')
      .addOrderBy('item.sortOrder', 'ASC');

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(sale.customerName) LIKE :term OR LOWER(sale.saleNumber) LIKE :term OR LOWER(sale.customerTaxId) LIKE :term OR LOWER(sale.notes) LIKE :term)',
        { term },
      );
    }

    if (filters?.saleType) {
      qb.andWhere('sale.saleType = :saleType', { saleType: filters.saleType });
    }

    if (filters?.paymentTerm) {
      qb.andWhere('sale.paymentTerm = :paymentTerm', {
        paymentTerm: filters.paymentTerm,
      });
    }

    if (filters?.paidStatus) {
      qb.andWhere('sale.paidStatus = :paidStatus', {
        paidStatus: filters.paidStatus,
      });
    }

    if (filters?.status) {
      qb.andWhere('sale.status = :status', { status: filters.status });
    }

    if (filters?.customerName) {
      const term = `%${filters.customerName.toLowerCase()}%`;
      qb.andWhere('LOWER(sale.customerName) LIKE :term', { term });
    }

    if (filters?.startDate) {
      qb.andWhere('sale.saleDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('sale.saleDate <= :endDate', { endDate: end });
    }

    if (filters?.limit) {
      qb.take(filters.limit);
    }
    if (filters?.offset) {
      qb.skip(filters.offset);
    }

    const [orms, total] = await qb.getManyAndCount();
    return {
      sales: SaleOrmMapper.toDomainList(orms),
      total,
    };
  }

  async findById(id: string): Promise<Sale | null> {
    const orm = await this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('product.uom', 'uom')
      .where('sale.id = :id AND sale.deletedAt IS NULL', { id })
      .orderBy('item.sortOrder', 'ASC')
      .getOne();

    return orm ? SaleOrmMapper.toDomain(orm) : null;
  }

  async findBySaleNumber(saleNumber: string): Promise<Sale | null> {
    const orm = await this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('product.uom', 'uom')
      .where('sale.saleNumber = :saleNumber AND sale.deletedAt IS NULL', {
        saleNumber: saleNumber.trim(),
      })
      .orderBy('item.sortOrder', 'ASC')
      .getOne();

    return orm ? SaleOrmMapper.toDomain(orm) : null;
  }

  async save(sale: Sale): Promise<Sale> {
    await this.dataSource.transaction(async (manager) => {
      const saleOrm = SaleOrmMapper.toOrm(sale);
      await manager.save(SaleOrmEntity, saleOrm);

      await manager.delete(SaleItemOrmEntity, { saleId: sale.id });
      if (sale.items && sale.items.length > 0) {
        const itemOrms = SaleItemOrmMapper.toOrmList(sale.items, sale.id);
        await manager.save(SaleItemOrmEntity, itemOrms);
      }
    });

    const saved = await this.findById(sale.id);
    return saved || sale;
  }

  async delete(id: string): Promise<void> {
    await this.saleRepo.softDelete(id);
  }

  async getNextSequenceNumber(type: SaleType): Promise<string> {
    const prefix = type === SaleType.QUOTATION ? 'COT' : 'VEN';
    const year = new Date().getFullYear();

    const count = await this.saleRepo
      .createQueryBuilder('sale')
      .withDeleted()
      .where('sale.saleType = :type', { type })
      .getCount();

    const nextSeq = String(count + 1).padStart(5, '0');
    return `${prefix}-${year}-${nextSeq}`;
  }

  async getStats(filters?: FindSalesFilters): Promise<SaleStatsSummary> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.deletedAt IS NULL');

    if (filters?.startDate) {
      qb.andWhere('sale.saleDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('sale.saleDate <= :endDate', { endDate: end });
    }

    const all = await qb.getMany();

    const totalSales = all.filter((s) => s.saleType === SaleType.DIRECT_SALE);
    const totalQuotations = all.filter(
      (s) => s.saleType === SaleType.QUOTATION,
    );
    const completedSales = totalSales.filter(
      (s) => s.status === SaleStatus.COMPLETED,
    );
    const draftCount = all.filter((s) => s.status === SaleStatus.DRAFT).length;
    const cancelledCount = all.filter(
      (s) => s.status === SaleStatus.CANCELLED,
    ).length;

    const totalRevenueUSD = completedSales.reduce(
      (sum, s) => sum + Number(s.total || 0),
      0,
    );
    const totalRevenueLocal = completedSales.reduce(
      (sum, s) => sum + Number(s.totalLocal || 0),
      0,
    );

    const averageTicketUSD =
      completedSales.length > 0
        ? Number((totalRevenueUSD / completedSales.length).toFixed(2))
        : 0;

    return {
      totalSalesCount: totalSales.length,
      totalQuotationsCount: totalQuotations.length,
      completedSalesCount: completedSales.length,
      draftCount,
      cancelledCount,
      totalRevenueUSD: Number(totalRevenueUSD.toFixed(2)),
      totalRevenueLocal: Number(totalRevenueLocal.toFixed(2)),
      averageTicketUSD,
    };
  }
}
