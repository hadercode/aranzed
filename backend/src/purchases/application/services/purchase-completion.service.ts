import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  MaterialPurchaseCompletedEvent,
  PurchaseCompletedItemPayload,
} from '@/purchases/domain/events/material-purchase-completed.event';

/**
 * Servicio de Aplicación responsable de emitir el evento de dominio/integración
 * MaterialPurchaseCompletedEvent a través del EventBus.
 *
 * El desacoplamiento garantiza que la actualización de inventarios o costos de catálogo
 * ocurra de forma reactiva (Event-Driven) en sus respectivos Bounded Contexts.
 */
@Injectable()
export class PurchaseCompletionService {
  constructor(private readonly eventBus: EventBus) {}

  /**
   * Prepara y emite el evento desacoplado de compra completada.
   */
  async completePurchase(purchase: Purchase): Promise<void> {
    await Promise.resolve();
    const eventItems: PurchaseCompletedItemPayload[] = purchase.items.map(
      (item) => ({
        materialId: item.materialId,
        sku: item.materialId.slice(0, 8).toUpperCase(),
        name: item.material?.name || item.description,
        uomSymbol: item.material?.uomCode || 'UN',
        description: item.description,
        quantity: item.quantity,
        unitCost: item.unitCost,
        unitCostLocal: item.unitCostLocal,
        batchNumber: item.batchNumber || null,
        expiryDate: item.expiryDate || null,
        isTaxable: item.isTaxable,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        taxAmountLocal: item.taxAmountLocal,
        subtotal: item.subtotal,
        subtotalLocal: item.subtotalLocal,
        total: item.total,
        totalLocal: item.totalLocal,
        currencySymbolFunctional: item.currencySymbolFunctional,
        currencySymbolLocal: item.currencySymbolLocal,
      }),
    );

    const eventPayload = new MaterialPurchaseCompletedEvent(
      purchase.id,
      purchase.purchaseNumber,
      purchase.supplierName,
      purchase.invoiceNumber,
      purchase.purchaseDate,
      purchase.status,
      purchase.exchangeRate,
      purchase.functionalCurrency,
      purchase.localCurrency,
      purchase.documentCurrency || 'USD',
      eventItems,
      purchase.subtotal,
      purchase.subtotalLocal,
      purchase.taxAmount,
      purchase.taxAmountLocal,
      purchase.total,
      purchase.totalLocal,
      purchase.createdById,
      purchase.warehouseId,
    );

    this.eventBus.publish(eventPayload);
  }
}
