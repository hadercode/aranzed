import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  IPurchaseRepository,
  IPurchaseReadRepository,
  IPurchaseWriteRepository,
  FindPurchasesFilters,
} from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseOrmEntity } from '../entities/purchase.orm-entity';
import { PurchaseItemOrmEntity } from '../entities/purchase-item.orm-entity';
import { PurchaseOrmMapper, PurchaseItemOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmPurchaseRepository
  implements
    IPurchaseRepository,
    IPurchaseReadRepository,
    IPurchaseWriteRepository
{
  constructor(
    @InjectRepository(PurchaseOrmEntity)
    private readonly purchaseRepo: Repository<PurchaseOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters?: FindPurchasesFilters,
  ): Promise<{ purchases: Purchase[]; total: number }> {
    const qb = this.purchaseRepo
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.items', 'item')
      .leftJoinAndSelect('item.material', 'material')
      .leftJoinAndSelect('material.uom', 'materialUom')
      .orderBy('purchase.purchaseDate', 'DESC')
      .addOrderBy('purchase.createdAt', 'DESC')
      .addOrderBy('item.sortOrder', 'ASC');

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(purchase.supplierName) LIKE :term OR LOWER(purchase.purchaseNumber) LIKE :term OR LOWER(purchase.invoiceNumber) LIKE :term)',
        { term },
      );
    }

    if (filters?.supplierName) {
      const term = `%${filters.supplierName.toLowerCase()}%`;
      qb.andWhere('LOWER(purchase.supplierName) LIKE :term', { term });
    }

    if (filters?.status) {
      qb.andWhere('purchase.status = :status', { status: filters.status });
    }

    if (filters?.startDate) {
      qb.andWhere('purchase.purchaseDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters?.endDate) {
      qb.andWhere('purchase.purchaseDate <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    if (filters?.limit) {
      qb.take(filters.limit);
    }
    if (filters?.offset) {
      qb.skip(filters.offset);
    }

    const [orms, total] = await qb.getManyAndCount();
    return {
      purchases: PurchaseOrmMapper.toDomainList(orms),
      total,
    };
  }

  async findById(id: string): Promise<Purchase | null> {
    const orm = await this.purchaseRepo
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.items', 'item')
      .leftJoinAndSelect('item.material', 'material')
      .leftJoinAndSelect('material.uom', 'materialUom')
      .where('purchase.id = :id', { id })
      .orderBy('item.sortOrder', 'ASC')
      .getOne();

    return orm ? PurchaseOrmMapper.toDomain(orm) : null;
  }

  async findByPurchaseNumber(purchaseNumber: string): Promise<Purchase | null> {
    const orm = await this.purchaseRepo.findOne({
      where: { purchaseNumber },
      relations: {
        items: {
          material: {
            uom: true,
          },
        },
      },
    });
    return orm ? PurchaseOrmMapper.toDomain(orm) : null;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Purchase | null> {
    const orm = await this.purchaseRepo.findOne({
      where: { invoiceNumber },
      relations: {
        items: {
          material: {
            uom: true,
          },
        },
      },
    });
    return orm ? PurchaseOrmMapper.toDomain(orm) : null;
  }

  async save(purchase: Purchase): Promise<Purchase> {
    // 1. Todo el bloque transaccional atómico
    await this.dataSource.transaction(async (manager) => {
      const purchaseOrm = PurchaseOrmMapper.toOrm(purchase);
      await manager.save(PurchaseOrmEntity, purchaseOrm);
      await manager.delete(PurchaseItemOrmEntity, { purchaseId: purchase.id });
      if (purchase.items && purchase.items.length > 0) {
        const itemOrms = PurchaseItemOrmMapper.toOrmList(
          purchase.items,
          purchase.id,
        );
        await manager.save(PurchaseItemOrmEntity, itemOrms);
      }
    });
    // 2. Transacción ya confirmada: consultamos el agregado con sus relaciones completas
    const saved = await this.findById(purchase.id);
    return saved || purchase;
  }

  async delete(id: string): Promise<void> {
    await this.purchaseRepo.softDelete(id);
  }

  async getNextSequenceNumber(): Promise<string> {
    const count = await this.purchaseRepo.count({ withDeleted: true });
    const seq = (count + 1).toString().padStart(4, '0');
    return `COM-${seq}`;
  }
}
