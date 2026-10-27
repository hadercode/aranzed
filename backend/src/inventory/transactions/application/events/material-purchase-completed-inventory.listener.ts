import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MaterialPurchaseCompletedEvent } from '@/purchases/domain/events/material-purchase-completed.event';
import { WarehousesService } from '@/inventory/warehouses/application/services/warehouses.service';
import {
  INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
  type IInventoryTransactionReadRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { CreateInventoryTransactionUseCase } from '../commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { CreateInventoryTransactionCommand } from '../commands/create-inventory-transaction/create-inventory-transaction.command';

@Injectable()
@EventsHandler(MaterialPurchaseCompletedEvent)
export class MaterialPurchaseCompletedInventoryListener implements IEventHandler<MaterialPurchaseCompletedEvent> {
  private readonly logger = new Logger(
    MaterialPurchaseCompletedInventoryListener.name,
  );

  constructor(
    private readonly createTransactionUseCase: CreateInventoryTransactionUseCase,
    private readonly warehousesService: WarehousesService,
    @Inject(INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN)
    private readonly readRepository: IInventoryTransactionReadRepository,
  ) {}

  async handle(event: MaterialPurchaseCompletedEvent): Promise<void> {
    try {
      this.logger.log(
        `[Inventory][EVENT_RECEIVED] Escuchando compra completada #${event.purchaseNumber} (ID: ${event.purchaseId}) con ${event.items.length} ítems.`,
      );

      // 1. Idempotencia: Verificar si ya existe una transacción de inventario para esta compra
      const existingTx = await this.readRepository.findByReference(
        'PURCHASE',
        event.purchaseId,
      );

      if (existingTx) {
        this.logger.warn(
          `[Inventory][Idempotencia] La compra #${event.purchaseNumber} ya fue procesada previamente con la transacción ${existingTx.transactionNumber}. Omitiendo creación duplicada.`,
        );
        return;
      }

      // 2. Resolver almacén de destino (el especificado o fallback al principal/ventas)
      let destWarehouseId = event.warehouseId;
      if (!destWarehouseId) {
        const warehouses = await this.warehousesService.findAll();
        const activeWarehouses = warehouses.filter((w) => w.isActive);
        const salesWarehouse = activeWarehouses.find((w) => w.isSalesWarehouse);
        destWarehouseId = salesWarehouse?.id || activeWarehouses[0]?.id;
      }

      if (!destWarehouseId) {
        this.logger.error(
          `[Inventory] No se pudo procesar el ingreso de la compra #${event.purchaseNumber}: No existe ningún almacén activo configurado en el sistema.`,
        );
        return;
      }

      // 3. Formatear fecha del movimiento (YYYY-MM-DD)
      const movementDate = event.purchaseDate
        ? typeof event.purchaseDate === 'string'
          ? event.purchaseDate
          : new Date(event.purchaseDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

      // 4. Mapear ítems con sus costos, lotes y snapshots
      const items = event.items.map((item) => {
        const expiryDateStr = item.expiryDate
          ? typeof item.expiryDate === 'string'
            ? item.expiryDate
            : new Date(item.expiryDate).toISOString().slice(0, 10)
          : undefined;

        return {
          productId: item.materialId,
          skuSnapshot: item.sku || 'SKU-PENDIENTE',
          nameSnapshot: item.name || item.description,
          uomSymbol: item.uomSymbol || 'UN',
          quantity: Number(item.quantity),
          cost: Number(item.unitCost),
          batchNumber: item.batchNumber || undefined,
          expiryDate: expiryDateStr,
          customComment: `Ingreso automático por compra #${event.purchaseNumber} (Factura: ${event.invoiceNumber})`,
        };
      });

      // 5. Crear la transacción de recepción completada vía Use Case (incrementa existencia y genera Kárdex)
      const command = new CreateInventoryTransactionCommand({
        type: InventoryTransactionType.RECEPTION,
        status: InventoryTransactionStatus.COMPLETED,
        destWarehouseId,
        movementDate,
        referenceEntityType: 'PURCHASE',
        referenceEntityId: event.purchaseId,
        notes: `Ingreso automático por Compra #${event.purchaseNumber} - Factura: ${event.invoiceNumber} - Proveedor: ${event.supplierName}`,
        items,
        createdById: event.createdById || undefined,
      });

      const createdTx = await this.createTransactionUseCase.execute(command);

      this.logger.log(
        `[Inventory][STOCK_INGRESADO] Compra #${event.purchaseNumber} ingresada exitosamente al inventario. ` +
          `Transacción: ${createdTx.transactionNumber}, Almacén Destino: ${destWarehouseId}, Ítems procesados: ${items.length}. Kárdex actualizado.`,
      );
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `[Inventory][ERROR] Error al procesar el ingreso de inventario para la compra #${event.purchaseNumber}: ${err?.message || String(error)}`,
        err?.stack,
      );
      throw error;
    }
  }
}
