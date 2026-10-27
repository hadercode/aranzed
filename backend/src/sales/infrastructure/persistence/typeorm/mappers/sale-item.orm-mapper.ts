import { SaleItem } from '@/sales/domain/entities/sale-item.entity';
import { SaleItemOrmEntity } from '../entities/sale-item.orm-entity';

export class SaleItemOrmMapper {
  static toDomain(orm: SaleItemOrmEntity, exchangeRate = 1.0): SaleItem {
    return new SaleItem(
      {
        id: orm.id,
        saleId: orm.saleId,
        productId: orm.productId,
        description: orm.description,
        productType: orm.productType,
        quantity: Number(orm.quantity),
        unitPrice: Number(orm.unitPrice),
        unitCost: Number(orm.unitCost),
        discountRate: Number(orm.discountRate),
        discountAmount: Number(orm.discountAmount),
        isTaxable: orm.isTaxable,
        taxRate: Number(orm.taxRate),
        taxAmount: Number(orm.taxAmount),
        subtotal: Number(orm.subtotal),
        total: Number(orm.total),
        unitPriceLocal: Number(orm.unitPriceLocal) || 0,
        subtotalLocal: Number(orm.subtotalLocal) || 0,
        discountAmountLocal: Number(orm.discountAmountLocal) || 0,
        taxAmountLocal: Number(orm.taxAmountLocal) || 0,
        totalLocal: Number(orm.totalLocal) || 0,
        currencySymbolFunctional: orm.currencySymbolFunctional || '$',
        currencySymbolLocal: orm.currencySymbolLocal || 'Bs.',
        sortOrder: orm.sortOrder,
        product: orm.product
          ? {
              id: orm.product.id,
              name: orm.product.name,
              type: orm.product.type,
              uomCode: orm.product.uom?.code,
              uomName: orm.product.uom?.name,
              imageUrl: orm.product.imageUrl,
              lastCost: Number(orm.product.lastCost),
              lastSalePrice: Number(orm.product.lastSalePrice),
            }
          : null,
      },
      exchangeRate,
    );
  }

  static toDomainList(
    orms: SaleItemOrmEntity[],
    exchangeRate = 1.0,
  ): SaleItem[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm, exchangeRate));
  }

  static toOrm(domain: SaleItem, saleId: string): SaleItemOrmEntity {
    const orm = new SaleItemOrmEntity();
    Object.assign(orm, {
      id: domain.id,
      saleId,
      productId: domain.productId,
      description: domain.description,
      productType: domain.productType || 'TRADITIONAL',
      quantity: domain.quantity,
      unitPrice: domain.unitPrice,
      unitCost: domain.unitCost || 0,
      discountRate: domain.discountRate || 0,
      discountAmount: domain.discountAmount || 0,
      isTaxable: domain.isTaxable !== undefined ? domain.isTaxable : true,
      taxRate: domain.taxRate !== undefined ? domain.taxRate : 16.0,
      taxAmount: domain.taxAmount || 0,
      subtotal: domain.subtotal,
      total: domain.total,
      unitPriceLocal: domain.unitPriceLocal || 0,
      unitCostLocal: domain.unitCostLocal || 0,
      subtotalLocal: domain.subtotalLocal || 0,
      discountAmountLocal: domain.discountAmountLocal || 0,
      taxAmountLocal: domain.taxAmountLocal || 0,
      totalLocal: domain.totalLocal || 0,
      currencySymbolFunctional: domain.currencySymbolFunctional || '$',
      currencySymbolLocal: domain.currencySymbolLocal || 'Bs.',
      sortOrder: domain.sortOrder || 0,
    });
    return orm;
  }

  static toOrmList(domains: SaleItem[], saleId: string): SaleItemOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain) => this.toOrm(domain, saleId));
  }
}
