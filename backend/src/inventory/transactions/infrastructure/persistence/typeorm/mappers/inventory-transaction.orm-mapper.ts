import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionOrmEntity } from '../entities/inventory-transaction.orm-entity';
import { InventoryTransactionItemOrmMapper } from './inventory-transaction-item.orm-mapper';

export class InventoryTransactionOrmMapper {
  static toDomain(orm: InventoryTransactionOrmEntity): InventoryTransaction {
    const items = InventoryTransactionItemOrmMapper.toDomainList(
      orm.items || [],
    );

    const transaction = new InventoryTransaction({
      id: orm.id,
      tenantId: orm.tenantId || null,
      companyId: orm.companyId || null,
      transactionNumber: orm.transactionNumber,
      type: orm.type,
      reasonId: orm.reasonId || null,
      originWarehouseId: orm.originWarehouseId || null,
      destWarehouseId: orm.destWarehouseId || null,
      status: orm.status,
      movementDate: orm.movementDate ? new Date(orm.movementDate) : new Date(),
      referenceEntityType: orm.referenceEntityType || null,
      referenceEntityId: orm.referenceEntityId || null,
      notes: orm.notes || null,
      documents: orm.documents || null,
      createdById: orm.createdById || null,
      deletedAt: orm.deletedAt || null,
      items,
      reason: orm.reason
        ? {
            id: orm.reason.id,
            name: orm.reason.name,
            type: orm.reason.type,
          }
        : null,
      originWarehouse: orm.originWarehouse
        ? {
            id: orm.originWarehouse.id,
            name: orm.originWarehouse.name,
            code: orm.originWarehouse.code,
          }
        : null,
      destWarehouse: orm.destWarehouse
        ? {
            id: orm.destWarehouse.id,
            name: orm.destWarehouse.name,
            code: orm.destWarehouse.code,
          }
        : null,
    });

    transaction.createdAt = orm.createdAt;
    transaction.updatedAt = orm.updatedAt;
    return transaction;
  }

  static toDomainList(
    orms: InventoryTransactionOrmEntity[],
  ): InventoryTransaction[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm));
  }

  static toOrm(domain: InventoryTransaction): InventoryTransactionOrmEntity {
    const orm = new InventoryTransactionOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.tenantId = domain.tenantId || null;
    orm.companyId = domain.companyId || null;
    orm.transactionNumber = domain.transactionNumber;
    orm.type = domain.type;
    orm.reasonId = domain.reasonId || null;
    orm.originWarehouseId = domain.originWarehouseId || null;
    orm.destWarehouseId = domain.destWarehouseId || null;
    orm.status = domain.status;
    orm.movementDate = domain.movementDate
      ? new Date(domain.movementDate)
      : new Date();
    orm.referenceEntityType = domain.referenceEntityType || null;
    orm.referenceEntityId = domain.referenceEntityId || null;
    orm.notes = domain.notes || null;
    orm.documents = domain.documents || null;
    orm.createdById = domain.createdById || null;

    if (domain.items && domain.items.length > 0) {
      orm.items = InventoryTransactionItemOrmMapper.toOrmList(
        domain.items,
        domain.id,
      );
    } else {
      orm.items = [];
    }

    return orm;
  }

  static toOrmList(
    domains: InventoryTransaction[] | undefined,
  ): InventoryTransactionOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain) => this.toOrm(domain));
  }
}
