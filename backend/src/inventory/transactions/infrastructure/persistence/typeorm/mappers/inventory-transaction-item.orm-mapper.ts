import { InventoryTransactionItem } from '@/inventory/transactions/domain/entities/inventory-transaction-item.entity';
import { InventoryTransactionItemOrmEntity } from '../entities/inventory-transaction-item.orm-entity';

export class InventoryTransactionItemOrmMapper {
  static toDomain(
    orm: InventoryTransactionItemOrmEntity,
  ): InventoryTransactionItem {
    const item = new InventoryTransactionItem({
      id: orm.id,
      transactionId: orm.transactionId,
      productId: orm.productId,
      variantId: orm.variantId || null,
      skuSnapshot: orm.skuSnapshot,
      nameSnapshot: orm.nameSnapshot,
      uomSymbol: orm.uomSymbol,
      quantity: Number(orm.quantity) || 0,
      cost:
        orm.cost !== null && orm.cost !== undefined ? Number(orm.cost) : null,
      secQuantity:
        orm.secQuantity !== null && orm.secQuantity !== undefined
          ? Number(orm.secQuantity)
          : null,
      secUomSymbol: orm.secUomSymbol || null,
      batchNumber: orm.batchNumber || null,
      expiryDate: orm.expiryDate ? new Date(orm.expiryDate) : null,
      customComment: orm.customComment || null,
      tenantId: orm.tenantId || null,
      companyId: orm.companyId || null,
      createdById: orm.createdById || null,
      product: orm.product
        ? {
            id: orm.product.id,
            name: orm.product.name,
            imageUrl: orm.product.imageUrl || null,
          }
        : null,
    });

    item.createdAt = orm.createdAt;
    item.updatedAt = orm.updatedAt;
    return item;
  }

  static toDomainList(
    orms: InventoryTransactionItemOrmEntity[],
  ): InventoryTransactionItem[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm));
  }

  static toOrm(
    domain: InventoryTransactionItem,
    transactionId?: string,
  ): InventoryTransactionItemOrmEntity {
    const orm = new InventoryTransactionItemOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.transactionId = transactionId || domain.transactionId!;
    orm.productId = domain.productId;
    orm.variantId = domain.variantId || null;
    orm.skuSnapshot = domain.skuSnapshot;
    orm.nameSnapshot = domain.nameSnapshot;
    orm.uomSymbol = domain.uomSymbol;
    orm.quantity = domain.quantity;
    orm.cost =
      domain.cost !== null && domain.cost !== undefined ? domain.cost : null;
    orm.secQuantity =
      domain.secQuantity !== null && domain.secQuantity !== undefined
        ? domain.secQuantity
        : null;
    orm.secUomSymbol = domain.secUomSymbol || null;
    orm.batchNumber = domain.batchNumber || null;
    orm.expiryDate = domain.expiryDate ? new Date(domain.expiryDate) : null;
    orm.customComment = domain.customComment || null;
    orm.tenantId = domain.tenantId || null;
    orm.companyId = domain.companyId || null;
    orm.createdById = domain.createdById || null;
    return orm;
  }

  static toOrmList(
    domains: InventoryTransactionItem[],
    transactionId?: string,
  ): InventoryTransactionItemOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain) => this.toOrm(domain, transactionId));
  }
}
