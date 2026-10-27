import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseItem } from '@/purchases/domain/entities/purchase-item.entity';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export interface PurchaseCurrencyContext {
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;
}

export interface PurchaseCommandPayload {
  id?: string;
  purchaseNumber?: string;
  supplierName: string;
  purchaseDate?: Date | string;
  description?: string | null;
  status?: PurchaseStatus;
  invoiceNumber: string;
  warehouseId?: string | null;
  exchangeRate?: number;
  functionalCurrency?: string;
  localCurrency?: string;
  documentCurrency?: string;
  createdById?: string | null;
}

/**
 * Mapper de la Capa de Aplicación.
 * Construye el agregado de dominio `Purchase` a partir de comandos CQRS y resuelve
 * las políticas de moneda y tasa de cambio.
 */
export class PurchaseCommandMapper {
  /**
   * Normaliza los códigos de moneda y tasa de cambio garantizando valores por defecto consistentes.
   */
  static resolveCurrencies(params: {
    exchangeRate?: number;
    functionalCurrency?: string;
    localCurrency?: string;
    documentCurrency?: string;
  }): PurchaseCurrencyContext {
    const exchangeRate =
      params.exchangeRate !== undefined && Number(params.exchangeRate) > 0
        ? Number(params.exchangeRate)
        : 1.0;
    const functionalCurrency = params.functionalCurrency || 'USD';
    const localCurrency = params.localCurrency || 'VES';
    const documentCurrency = params.documentCurrency || 'USD';

    return {
      exchangeRate,
      functionalCurrency,
      localCurrency,
      documentCurrency,
    };
  }

  /**
   * Construye un agregado de Dominio `Purchase` a partir del payload de un comando y sus renglones ya instanciados.
   */
  static toDomain(
    command: PurchaseCommandPayload,
    items: PurchaseItem[] = [],
  ): Purchase {
    const currencies = this.resolveCurrencies(command);

    const purchase = new Purchase({
      id: command.id,
      purchaseNumber: command.purchaseNumber,
      supplierName: command.supplierName?.trim(),
      purchaseDate: command.purchaseDate
        ? new Date(command.purchaseDate)
        : new Date(),
      description: command.description?.trim() || null,
      status: command.status || PurchaseStatus.DRAFT,
      invoiceNumber: command.invoiceNumber?.trim(),
      warehouseId: command.warehouseId || null,
      createdById:
        typeof command.createdById === 'string'
          ? command.createdById
          : undefined,
      ...currencies,
      items,
    });

    purchase.calculateTotals();
    return purchase;
  }

  /**
   * Alias de conveniencia para `toDomain`
   */
  static fromCommand(
    command: PurchaseCommandPayload,
    items: PurchaseItem[] = [],
  ): Purchase {
    return PurchaseCommandMapper.toDomain(command, items);
  }
}
