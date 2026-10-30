import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInventoryTransactionUseCase } from '@/inventory/transactions/application/commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { CreateInventoryTransactionCommand } from '@/inventory/transactions/application/commands/create-inventory-transaction/create-inventory-transaction.command';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';

import { ExecuteStockImportCommand } from './execute-stock-import.command';
import type {
  BulkStockImportSummary,
  BulkStockImportItemValidation,
} from '../../models/stock-import.models';

@CommandHandler(ExecuteStockImportCommand)
export class ExecuteStockImportHandler
  implements ICommandHandler<ExecuteStockImportCommand, BulkStockImportSummary>
{
  constructor(
    private readonly createTransactionUseCase: CreateInventoryTransactionUseCase,
  ) {}

  async execute(
    command: ExecuteStockImportCommand,
  ): Promise<BulkStockImportSummary> {
    const validItems = command.items.filter(
      (item) => item.status === 'VALID' && item.resolvedProductId && item.resolvedWarehouseId,
    );

    const summary: BulkStockImportSummary = {
      totalProcessed: command.items.length,
      createdCount: 0,
      failedCount: 0,
      errors: [],
    };

    if (validItems.length === 0) {
      return summary;
    }

    // Agrupar artículos válidos por almacén de destino
    const itemsByWarehouse = new Map<string, BulkStockImportItemValidation[]>();
    for (const item of validItems) {
      const warehouseId = item.resolvedWarehouseId!;
      const list = itemsByWarehouse.get(warehouseId) || [];
      list.push(item);
      itemsByWarehouse.set(warehouseId, list);
    }

    // Por cada almacén, generar una transacción oficial de RECEPCIÓN (Saldo Inicial) en estado COMPLETED
    for (const [warehouseId, items] of itemsByWarehouse.entries()) {
      try {
        const movementDate = items[0]?.entryDate || new Date().toISOString().slice(0, 10);

        const txCommand = new CreateInventoryTransactionCommand({
          type: InventoryTransactionType.RECEPTION,
          destWarehouseId: warehouseId,
          status: InventoryTransactionStatus.COMPLETED,
          movementDate,
          referenceEntityType: 'INITIAL_BALANCE',
          notes: 'Carga Masiva de Saldos Iniciales e Inventario',
          items: items.map((item) => ({
            productId: item.resolvedProductId!,
            skuSnapshot: item.productName,
            nameSnapshot: item.productName,
            uomSymbol: item.uomSymbol || 'UND',
            quantity: item.quantity,
            cost: item.unitCost,
            batchNumber: item.batchNumber || undefined,
          })),
          createdById: command.userId,
        });

        await this.createTransactionUseCase.execute(txCommand);
        summary.createdCount += items.length;
      } catch (err: any) {
        summary.failedCount += items.length;
        summary.errors.push({
          name: `Almacén ${items[0]?.warehouseName || warehouseId}`,
          message: err.message || 'Error al procesar la transacción de saldo inicial',
        });
      }
    }

    return summary;
  }
}

