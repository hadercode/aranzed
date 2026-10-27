import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseOrmEntity } from '../entities/purchase.orm-entity';
import { PurchaseItemOrmMapper } from './purchase-item.orm-mapper';

export interface PurchaseOrmFinancialTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
  subtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;
}

export interface PurchaseOrmCurrencies {
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;
}

/**
 * Mapper de Persistencia (TypeORM).
 * Responsable exclusivo de la bidireccionalidad entre `PurchaseOrmEntity` y `Purchase`.
 * No contiene lógica de comandos ni DTOs HTTP.
 */
export class PurchaseOrmMapper {
  /**
   * Mapea de la entidad TypeORM `PurchaseOrmEntity` al agregado de Dominio `Purchase`.
   */
  static toDomain(orm: PurchaseOrmEntity): Purchase {
    const currencies = this.extractCurrencies(orm);
    const financials = this.extractFinancialTotals(orm);
    const items = PurchaseItemOrmMapper.toDomainList(
      orm.items || [],
      currencies.exchangeRate,
    );

    const purchase = new Purchase({
      id: orm.id,
      purchaseNumber: orm.purchaseNumber,
      supplierName: orm.supplierName,
      purchaseDate: orm.purchaseDate ? new Date(orm.purchaseDate) : new Date(),
      description: orm.description,
      status: orm.status,
      invoiceNumber: orm.invoiceNumber,
      warehouseId: orm.warehouseId || null,
      createdById: orm.createdById || null,
      ...currencies,
      ...financials,
      items,
    });

    purchase.createdAt = orm.createdAt;
    purchase.updatedAt = orm.updatedAt;
    purchase.deletedAt = orm.deletedAt || null;

    return purchase;
  }

  /**
   * Mapea una lista de entidades ORM a una colección de agregados de dominio.
   */
  static toDomainList(orms: PurchaseOrmEntity[]): Purchase[] {
    if (!orms || orms.length === 0) return [];
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Mapea del agregado de Dominio `Purchase` a la entidad TypeORM `PurchaseOrmEntity`.
   */
  static toOrm(domain: Purchase): PurchaseOrmEntity {
    const currencies = this.extractCurrencies(domain);
    const financials = this.extractFinancialTotals(domain);

    const orm = new PurchaseOrmEntity();
    Object.assign(orm, {
      id: domain.id,
      purchaseNumber: domain.purchaseNumber,
      supplierName: domain.supplierName,
      purchaseDate: domain.purchaseDate
        ? new Date(domain.purchaseDate)
        : new Date(),
      description: domain.description ?? null,
      status: domain.status,
      invoiceNumber: domain.invoiceNumber,
      warehouseId: domain.warehouseId || null,
      createdById:
        typeof domain.createdById === 'string' ? domain.createdById : null,
      ...currencies,
      ...financials,
      items: domain.items?.length
        ? PurchaseItemOrmMapper.toOrmList(domain.items, domain.id)
        : [],
    });

    return orm;
  }

  /**
   * Mapea una lista de agregados de dominio a entidades ORM.
   */
  static toOrmList(domains: Purchase[]): PurchaseOrmEntity[] {
    if (!domains || domains.length === 0) return [];
    return domains.map((domain) => this.toOrm(domain));
  }

  /**
   * Extrae y normaliza los parámetros de moneda y tasa para TypeORM.
   */
  private static extractCurrencies(source: {
    exchangeRate?: number;
    functionalCurrency?: string;
    localCurrency?: string;
    documentCurrency?: string;
  }): PurchaseOrmCurrencies {
    return {
      exchangeRate:
        source.exchangeRate !== undefined && Number(source.exchangeRate) > 0
          ? Number(source.exchangeRate)
          : 1.0,
      functionalCurrency: source.functionalCurrency || 'USD',
      localCurrency: source.localCurrency || 'VES',
      documentCurrency: source.documentCurrency || 'USD',
    };
  }

  /**
   * Extrae y normaliza los totales monetarios funcionales y locales.
   */
  private static extractFinancialTotals(source: {
    subtotal?: number;
    taxAmount?: number;
    total?: number;
    subtotalLocal?: number;
    taxAmountLocal?: number;
    totalLocal?: number;
  }): PurchaseOrmFinancialTotals {
    return {
      subtotal: Number(source.subtotal) || 0,
      taxAmount: Number(source.taxAmount) || 0,
      total: Number(source.total) || 0,
      subtotalLocal: Number(source.subtotalLocal) || 0,
      taxAmountLocal: Number(source.taxAmountLocal) || 0,
      totalLocal: Number(source.totalLocal) || 0,
    };
  }
}

// Alias para compatibilidad
export const PurchaseMapper = PurchaseOrmMapper;
