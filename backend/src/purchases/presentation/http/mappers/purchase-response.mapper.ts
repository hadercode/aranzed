import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseItem } from '@/purchases/domain/entities/purchase-item.entity';
import { PurchaseResponseDto, PurchaseItemResponseDto } from '../dto';

/**
 * Mapper de la Capa de Presentación (HTTP).
 * Responsable exclusivo de transformar agregados y entidades de Dominio
 * a DTOs de respuesta HTTP formateados para el cliente.
 */
export class PurchaseResponseMapper {
  /**
   * Mapea una entidad PurchaseItem de Dominio a su DTO de respuesta HTTP.
   */
  static toItemDto(item: PurchaseItem): PurchaseItemResponseDto {
    const dto = new PurchaseItemResponseDto();
    dto.id = item.id;
    dto.purchaseId = item.purchaseId;
    dto.materialId = item.materialId;
    dto.description = item.description;
    dto.quantity = item.quantity;
    dto.unitCost = item.unitCost;
    dto.unitCostLocal = item.unitCostLocal;
    dto.currencySymbolFunctional = item.currencySymbolFunctional;
    dto.currencySymbolLocal = item.currencySymbolLocal;
    dto.isTaxable = item.isTaxable;
    dto.taxRate = item.taxRate;
    dto.taxAmount = item.taxAmount;
    dto.taxAmountLocal = item.taxAmountLocal;
    dto.subtotal = item.subtotal;
    dto.subtotalLocal = item.subtotalLocal;
    dto.total = item.total;
    dto.totalLocal = item.totalLocal;
    dto.sortOrder = item.sortOrder;
    dto.batchNumber = item.batchNumber || null;
    dto.expiryDate = item.expiryDate ? item.expiryDate.toISOString() : null;
    dto.material = item.material || null;
    return dto;
  }

  /**
   * Mapea el agregado Purchase de Dominio al DTO de respuesta HTTP.
   */
  static toDto(purchase: Purchase): PurchaseResponseDto {
    const dto = new PurchaseResponseDto();
    dto.id = purchase.id;
    dto.purchaseNumber = purchase.purchaseNumber;
    dto.supplierName = purchase.supplierName;
    dto.purchaseDate = purchase.purchaseDate
      ? purchase.purchaseDate.toISOString()
      : new Date().toISOString();
    dto.description = purchase.description || null;
    dto.status = purchase.status;
    dto.invoiceNumber = purchase.invoiceNumber;
    dto.warehouseId = purchase.warehouseId || null;
    dto.exchangeRate = purchase.exchangeRate;
    dto.functionalCurrency = purchase.functionalCurrency;
    dto.localCurrency = purchase.localCurrency;
    dto.documentCurrency = purchase.documentCurrency;
    dto.subtotal = purchase.subtotal;
    dto.taxAmount = purchase.taxAmount;
    dto.total = purchase.total;
    dto.subtotalLocal = purchase.subtotalLocal;
    dto.taxAmountLocal = purchase.taxAmountLocal;
    dto.totalLocal = purchase.totalLocal;
    dto.createdById = purchase.createdById || null;
    dto.createdAt = purchase.createdAt
      ? purchase.createdAt.toISOString()
      : undefined;
    dto.updatedAt = purchase.updatedAt
      ? purchase.updatedAt.toISOString()
      : undefined;
    dto.items = purchase.items
      ? purchase.items.map((item) => this.toItemDto(item))
      : [];
    return dto;
  }

  /**
   * Mapea una lista de compras de Dominio a una lista de DTOs de respuesta HTTP.
   */
  static toDtoList(purchases: Purchase[]): PurchaseResponseDto[] {
    return (purchases || []).map((purchase) => this.toDto(purchase));
  }
}
