import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Sale } from '@/sales/domain/entities/sale.entity';
import {
  SaleCompletedEvent,
  type SaleCompletedEventItem,
} from '@/sales/domain/events/sale-completed.event';
import { SalePaymentStatusChangedEvent } from '@/sales/domain/events/sale-payment-status-changed.event';
import { SaleCancelledEvent } from '@/sales/domain/events/sale-cancelled.event';

@Injectable()
export class SaleCompletionService {
  constructor(private readonly eventBus: EventBus) {}

  async completeSale(sale: Sale): Promise<void> {
    await Promise.resolve();

    const items: SaleCompletedEventItem[] = (sale.items || []).map((it) => ({
      productId: it.productId,
      sku: it.product?.id ? it.productId.slice(0, 8).toUpperCase() : undefined,
      name: it.product?.name || it.description,
      uomSymbol: it.product?.uomCode || 'UN',
      description: it.description,
      productType: it.productType || 'TRADITIONAL',
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      unitCost: Number(it.unitCost),
      subtotal: Number(it.subtotal),
      total: Number(it.total),
    }));

    const event = new SaleCompletedEvent(
      sale.id,
      sale.saleNumber,
      sale.saleType,
      sale.customerName,
      sale.saleDate,
      sale.exchangeRate,
      sale.functionalCurrency,
      sale.localCurrency,
      sale.documentCurrency,
      items,
      sale.subtotal,
      sale.subtotalLocal,
      sale.taxAmount,
      sale.taxAmountLocal,
      sale.total,
      sale.totalLocal,
      sale.createdById,
      sale.warehouseId,
    );

    this.eventBus.publish(event);
  }

  async publishPaymentStatusChanged(
    sale: Sale,
    previousPaidStatus: string,
    newPaidStatus: string,
    userId?: string,
  ): Promise<void> {
    await Promise.resolve();

    const event = new SalePaymentStatusChangedEvent(
      sale.id,
      sale.saleNumber,
      previousPaidStatus,
      newPaidStatus,
      sale.paymentTerm,
      sale.dueDate || null,
      sale.customerName,
      sale.customerTaxId || null,
      sale.total,
      sale.totalLocal,
      sale.functionalCurrency,
      sale.localCurrency,
      sale.exchangeRate,
      new Date(),
      userId || sale.createdById,
    );

    this.eventBus.publish(event);
  }

  async publishSaleCancelled(
    sale: Sale,
    reason?: string,
    userId?: string,
  ): Promise<void> {
    await Promise.resolve();

    const items = (sale.items || []).map((it) => ({
      productId: it.productId,
      quantity: Number(it.quantity),
    }));

    const event = new SaleCancelledEvent(
      sale.id,
      sale.saleNumber,
      reason || 'Anulación de venta',
      items,
      userId || sale.createdById,
    );

    this.eventBus.publish(event);
  }
}
