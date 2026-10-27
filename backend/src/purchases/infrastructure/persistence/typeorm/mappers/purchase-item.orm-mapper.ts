import { PurchaseItem } from '@/purchases/domain/entities/purchase-item.entity';
import { PurchaseItemOrmEntity } from '../entities/purchase-item.orm-entity';

/**
 * Mapper de Persistencia (TypeORM).
 * Responsable exclusivo de la bidireccionalidad entre `PurchaseItemOrmEntity` y `PurchaseItem`.
 */
export class PurchaseItemOrmMapper {
  /**
   * Mapea de la entidad TypeORM (persistencia) a la entidad de Dominio `PurchaseItem`.
   */
  static toDomain(
    orm: PurchaseItemOrmEntity,
    exchangeRate: number = 1.0,
  ): PurchaseItem {
    const rate = exchangeRate > 0 ? exchangeRate : 1.0;

    return new PurchaseItem(
      {
        id: orm.id,
        purchaseId: orm.purchaseId,
        materialId: orm.materialId,
        description: orm.description,
        quantity: Number(orm.quantity),
        unitCost: Number(orm.unitCost),
        isTaxable: orm.isTaxable !== undefined ? Boolean(orm.isTaxable) : true,
        taxRate: Number(orm.taxRate),
        taxAmount: Number(orm.taxAmount),
        subtotal: Number(orm.subtotal),
        total: Number(orm.total),
        currencySymbolFunctional: orm.currencySymbolFunctional || '$',
        currencySymbolLocal: orm.currencySymbolLocal || 'Bs.',
        unitCostLocal: Number(orm.unitCostLocal) || 0,
        subtotalLocal: Number(orm.subtotalLocal) || 0,
        taxAmountLocal: Number(orm.taxAmountLocal) || 0,
        totalLocal: Number(orm.totalLocal) || 0,
        sortOrder: orm.sortOrder !== undefined ? Number(orm.sortOrder) : 0,
        batchNumber: orm.batchNumber || null,
        expiryDate: orm.expiryDate ? new Date(orm.expiryDate) : null,
        material: orm.material
          ? {
              id: orm.material.id,
              name: orm.material.name,
              type: orm.material.type,
              uomCode: orm.material.uom?.code,
              uomName: orm.material.uom?.name,
              lastCost: Number(orm.material.lastCost),
            }
          : null,
      },
      rate,
    );
  }

  /**
   * Mapea de la entidad de Dominio `PurchaseItem` a la entidad TypeORM `PurchaseItemOrmEntity`.
   */
  static toOrm(
    domain: PurchaseItem,
    purchaseIdFallback?: string,
    sortOrderFallback?: number,
  ): PurchaseItemOrmEntity {
    const orm = new PurchaseItemOrmEntity();
    orm.id = domain.id;
    orm.purchaseId = domain.purchaseId || purchaseIdFallback || '';
    orm.materialId = domain.materialId;
    orm.description = domain.description;
    orm.quantity = Number(domain.quantity);
    orm.currencySymbolFunctional = domain.currencySymbolFunctional || '$';
    orm.currencySymbolLocal = domain.currencySymbolLocal || 'Bs.';
    orm.unitCost = Number(domain.unitCost);
    orm.unitCostLocal = Number(domain.unitCostLocal) || 0;
    orm.isTaxable =
      domain.isTaxable !== undefined ? Boolean(domain.isTaxable) : true;
    orm.taxRate = Number(domain.taxRate);
    orm.taxAmount = Number(domain.taxAmount);
    orm.taxAmountLocal = Number(domain.taxAmountLocal) || 0;
    orm.subtotal = Number(domain.subtotal);
    orm.subtotalLocal = Number(domain.subtotalLocal) || 0;
    orm.total = Number(domain.total);
    orm.totalLocal = Number(domain.totalLocal) || 0;
    orm.sortOrder =
      domain.sortOrder !== undefined
        ? Number(domain.sortOrder)
        : (sortOrderFallback ?? 0);
    orm.batchNumber = domain.batchNumber || null;
    orm.expiryDate = domain.expiryDate ? new Date(domain.expiryDate) : null;
    return orm;
  }

  /**
   * Mapea una lista de entidades ORM a entidades de dominio.
   */
  static toDomainList(
    orms: PurchaseItemOrmEntity[],
    exchangeRate: number = 1.0,
  ): PurchaseItem[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm, exchangeRate));
  }

  /**
   * Mapea una lista de entidades de dominio a entidades ORM para persistencia en lote.
   */
  static toOrmList(
    domains: PurchaseItem[],
    purchaseIdFallback?: string,
  ): PurchaseItemOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain, index) =>
      this.toOrm(domain, purchaseIdFallback, index),
    );
  }
}

// Alias para compatibilidad
export const PurchaseItemMapper = PurchaseItemOrmMapper;
