import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import {
  IInventoryTransactionRepository,
  IInventoryTransactionReadRepository,
  IInventoryTransactionWriteRepository,
  FindInventoryTransactionsFilters,
  PaginatedTransactionsQueryResult,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionOrmEntity } from '../entities/inventory-transaction.orm-entity';
import { InventoryTransactionItemOrmEntity } from '../entities/inventory-transaction-item.orm-entity';
import {
  InventoryTransactionOrmMapper,
  InventoryTransactionItemOrmMapper,
} from '../mappers';

@Injectable()
export class TypeOrmInventoryTransactionRepository
  implements
    IInventoryTransactionRepository,
    IInventoryTransactionReadRepository,
    IInventoryTransactionWriteRepository
{
  constructor(
    @InjectRepository(InventoryTransactionOrmEntity)
    private readonly transactionRepo: Repository<InventoryTransactionOrmEntity>,
    @InjectRepository(InventoryTransactionItemOrmEntity)
    private readonly itemRepo: Repository<InventoryTransactionItemOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters?: FindInventoryTransactionsFilters,
  ): Promise<PaginatedTransactionsQueryResult> {
    const qb = this.transactionRepo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('tx.originWarehouse', 'originWh')
      .leftJoinAndSelect('tx.destWarehouse', 'destWh')
      .leftJoinAndSelect('tx.reason', 'reason');

    if (filters?.type) {
      qb.andWhere('tx.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      qb.andWhere('tx.status = :status', { status: filters.status });
    }

    if (filters?.warehouseId) {
      qb.andWhere(
        '(tx.originWarehouseId = :warehouseId OR tx.destWarehouseId = :warehouseId)',
        { warehouseId: filters.warehouseId },
      );
    }

    if (filters?.search && filters.search.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      qb.andWhere(
        '(tx.transactionNumber ILIKE :search OR tx.referenceEntityId ILIKE :search OR tx.referenceEntityType ILIKE :search OR reason.name ILIKE :search OR originWh.name ILIKE :search OR destWh.name ILIKE :search)',
        { search: searchTerm },
      );
    }

    if (filters?.startDate) {
      qb.andWhere('tx.movementDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      qb.andWhere('tx.movementDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters?.limit) || 10));
    const skip = (page - 1) * limit;

    const sortDirection =
      String(filters?.sortOrder || 'DESC').toUpperCase() === 'ASC'
        ? 'ASC'
        : 'DESC';
    const sortBy = filters?.sortBy || 'movementDate';

    if (sortBy === 'movementDate') {
      qb.orderBy('tx.movementDate', sortDirection).addOrderBy(
        'tx.createdAt',
        sortDirection,
      );
    } else if (sortBy === 'reason') {
      qb.orderBy('reason.name', sortDirection);
    } else if (sortBy === 'originWarehouse') {
      qb.orderBy('originWh.name', sortDirection);
    } else if (sortBy === 'transactionNumber') {
      qb.orderBy('tx.transactionNumber', sortDirection);
    } else if (sortBy === 'type') {
      qb.orderBy('tx.type', sortDirection);
    } else if (sortBy === 'status') {
      qb.orderBy('tx.status', sortDirection);
    } else {
      qb.orderBy('tx.movementDate', 'DESC').addOrderBy('tx.createdAt', 'DESC');
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data: InventoryTransactionOrmMapper.toDomainList(data),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: string): Promise<InventoryTransaction | null> {
    const orm = await this.transactionRepo.findOne({
      where: { id },
      relations: {
        items: {
          product: true,
        },
        originWarehouse: true,
        destWarehouse: true,
        reason: true,
      },
    });
    return orm ? InventoryTransactionOrmMapper.toDomain(orm) : null;
  }

  async findByNumber(
    transactionNumber: string,
  ): Promise<InventoryTransaction | null> {
    const orm = await this.transactionRepo.findOne({
      where: { transactionNumber },
      relations: {
        items: {
          product: true,
        },
        originWarehouse: true,
        destWarehouse: true,
        reason: true,
      },
    });
    return orm ? InventoryTransactionOrmMapper.toDomain(orm) : null;
  }

  async findByReference(
    referenceEntityType: string,
    referenceEntityId: string,
  ): Promise<InventoryTransaction | null> {
    const orm = await this.transactionRepo.findOne({
      where: {
        referenceEntityType,
        referenceEntityId,
      },
      relations: {
        items: {
          product: true,
        },
        originWarehouse: true,
        destWarehouse: true,
        reason: true,
      },
    });
    return orm ? InventoryTransactionOrmMapper.toDomain(orm) : null;
  }

  async save(transaction: InventoryTransaction): Promise<InventoryTransaction> {
    await this.dataSource.transaction(async (manager) => {
      const orm = InventoryTransactionOrmMapper.toOrm(transaction);
      const savedOrm = await manager.save(InventoryTransactionOrmEntity, orm);

      // Sincronización atómica de renglones hijos
      await manager.delete(InventoryTransactionItemOrmEntity, {
        transactionId: savedOrm.id,
      });

      if (transaction.items && transaction.items.length > 0) {
        const itemOrms = InventoryTransactionItemOrmMapper.toOrmList(
          transaction.items,
          savedOrm.id,
        );
        await manager.save(InventoryTransactionItemOrmEntity, itemOrms);
      }
    });

    const refreshed = await this.findById(transaction.id);
    return refreshed || transaction;
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepo.softDelete(id);
  }

  async generateTransactionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `TX-${year}-`;
    const lastTx = await this.transactionRepo
      .createQueryBuilder('tx')
      .withDeleted()
      .where('tx.transaction_number LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('tx.transaction_number', 'DESC')
      .getOne();

    let nextSequence = 1;
    if (lastTx) {
      const parts = lastTx.transactionNumber.split('-');
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }

    return `${prefix}${nextSequence.toString().padStart(5, '0')}`;
  }
}
