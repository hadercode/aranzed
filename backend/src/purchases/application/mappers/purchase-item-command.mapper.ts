import { PurchaseItem } from '@/purchases/domain/entities/purchase-item.entity';

export interface PurchaseItemCommandDto {
  id?: string;
  materialId: string;
  description?: string;
  quantity: number;
  unitCost: number;
  unitCostLocal?: number;
  currencySymbolFunctional?: string;
  currencySymbolLocal?: string;
  isTaxable?: boolean;
  taxRate?: number;
  sortOrder?: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface PurchaseItemCommandContext {
  purchaseId: string;
  exchangeRate: number;
  sortOrder?: number;
  fallbackDescription?: string;
  documentCurrency?: string;
  localCurrency?: string;
}

/**
 * Mapper de la Capa de Aplicación.
 * Transforma comandos y DTOs de ítems hacia la entidad de dominio `PurchaseItem`,
 * aplicando validaciones financieras y resolución bimonetaria.
 */
export class PurchaseItemCommandMapper {
  /**
   * Resuelve y armoniza los costos unitarios en Moneda Funcional (USD) y Moneda Local (VES)
   * según la moneda de emisión del documento físico y la tasa de cambio vigente.
   */
  static resolveBimonetaryCosts(params: {
    unitCost: number;
    unitCostLocal?: number;
    exchangeRate: number;
    documentCurrency?: string;
    localCurrency?: string;
  }): { unitCostUSD: number; unitCostLocal: number } {
    const rate = params.exchangeRate > 0 ? params.exchangeRate : 1.0;
    let unitCostUSD = Number(params.unitCost) || 0;
    let unitCostLocal = Number(params.unitCostLocal) || 0;

    const documentCurrency = params.documentCurrency || 'USD';
    const localCurrency = params.localCurrency || 'VES';

    if (documentCurrency === localCurrency) {
      if (unitCostLocal <= 0 && unitCostUSD > 0) {
        unitCostLocal = unitCostUSD;
      }
      unitCostUSD = Number((unitCostLocal / rate).toFixed(4));
    } else {
      if (unitCostUSD <= 0 && unitCostLocal > 0) {
        unitCostUSD = Number((unitCostLocal / rate).toFixed(4));
      }
      unitCostLocal = Number((unitCostUSD * rate).toFixed(4));
    }

    return { unitCostUSD, unitCostLocal };
  }

  /**
   * Mapea un ítem proveniente de un DTO / Comando hacia la entidad de Dominio `PurchaseItem`.
   */
  static toDomain(
    dto: PurchaseItemCommandDto,
    context: PurchaseItemCommandContext,
  ): PurchaseItem {
    const rate = context.exchangeRate > 0 ? context.exchangeRate : 1.0;
    const sortOrder =
      dto.sortOrder !== undefined ? dto.sortOrder : (context.sortOrder ?? 0);

    const { unitCostUSD, unitCostLocal } = this.resolveBimonetaryCosts({
      unitCost: dto.unitCost,
      unitCostLocal: dto.unitCostLocal,
      exchangeRate: rate,
      documentCurrency: context.documentCurrency,
      localCurrency: context.localCurrency,
    });

    return new PurchaseItem(
      {
        id: dto.id,
        purchaseId: context.purchaseId,
        materialId: dto.materialId,
        description:
          dto.description?.trim() || context.fallbackDescription || '',
        quantity: Number(dto.quantity) || 1,
        unitCost: unitCostUSD,
        unitCostLocal,
        currencySymbolFunctional: dto.currencySymbolFunctional,
        currencySymbolLocal: dto.currencySymbolLocal,
        isTaxable: dto.isTaxable !== undefined ? Boolean(dto.isTaxable) : true,
        taxRate: dto.taxRate !== undefined ? Number(dto.taxRate) : 16.0,
        sortOrder,
        batchNumber:
          dto.batchNumber?.trim() ||
          `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(sortOrder + 1).toString().padStart(3, '0')}`,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      },
      rate,
    );
  }

  /**
   * Alias de conveniencia para `toDomain`
   */
  static fromDto(
    dto: PurchaseItemCommandDto,
    context: PurchaseItemCommandContext,
  ): PurchaseItem {
    return PurchaseItemCommandMapper.toDomain(dto, context);
  }
}
