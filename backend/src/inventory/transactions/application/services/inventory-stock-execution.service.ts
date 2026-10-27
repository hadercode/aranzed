import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionItem } from '@/inventory/transactions/domain/entities/inventory-transaction-item.entity';
import { InventoryStockOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/inventory-stock.orm-entity';
import { StockLedgerEntryOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/stock-ledger-entry.orm-entity';

export interface ConsumedStockChunk {
  batchNumber: string | null;
  entryDate: Date;
  unitCost: number;
  currencyCode: string;
  quantity: number;
  skuSnapshot: string;
  productNameSnapshot: string;
  uomSymbol: string;
  uomOriginalQty: number;
  secUomOriginalQty?: number | null;
  secPhysicalQty?: number | null;
  unitCostBase: number;
  currencyCodeBase: string;
  unitCostLocal: number;
  currencyCodeLocal: string;
  exchangeRateSnapshot: number;
}

@Injectable()
export class InventoryStockExecutionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Ejecuta el movimiento físico de existencias (FIFO) y el registro en el Kárdex
   * para una transacción en estado COMPLETED de forma atómica.
   */
  async processStockMovement(
    transaction: InventoryTransaction,
    userId?: string | null,
    externalEm?: EntityManager,
  ): Promise<void> {
    const runner = async (em: EntityManager) => {
      const hasOrigin = !!transaction.originWarehouseId;
      const hasDest = !!transaction.destWarehouseId;

      for (const item of transaction.items) {
        let chunksToReceive: ConsumedStockChunk[] = [];

        // 1. Salida de Almacén Origen (FIFO)
        if (hasOrigin) {
          chunksToReceive = await this.depleteFromOrigin(
            transaction,
            item,
            em,
            userId || undefined,
          );
        } else {
          // Entrada pura (RECEPTION o Ajuste positivo)
          const unitCost = Number(item.cost || 0);
          chunksToReceive.push({
            batchNumber: item.batchNumber || null,
            entryDate: transaction.movementDate,
            unitCost,
            currencyCode: 'USD',
            quantity: item.quantity,
            skuSnapshot: item.skuSnapshot,
            productNameSnapshot: item.nameSnapshot,
            uomSymbol: item.uomSymbol,
            uomOriginalQty: item.quantity,
            secUomOriginalQty: item.secQuantity || null,
            secPhysicalQty: item.secQuantity || null,
            unitCostBase: unitCost,
            currencyCodeBase: 'USD',
            unitCostLocal: unitCost,
            currencyCodeLocal: 'VES',
            exchangeRateSnapshot: 1.0,
          });
        }

        // 2. Ingreso en Almacén Destino
        if (hasDest) {
          await this.receiveInDestination(
            transaction,
            item,
            chunksToReceive,
            em,
            userId || undefined,
          );
        }
      }
    };

    if (externalEm) {
      await runner(externalEm);
    } else {
      await this.dataSource.transaction(async (em) => {
        await runner(em);
      });
    }
  }

  /**
   * Revierte el impacto físico en el stock y retira los asientos de Kárdex asociados.
   */
  async revertStockMovement(
    transaction: InventoryTransaction,
    externalEm?: EntityManager,
  ): Promise<void> {
    const runner = async (em: EntityManager) => {
      for (const item of transaction.items) {
        if (!item.id) continue;

        const ledgers = await em.find(StockLedgerEntryOrmEntity, {
          where: { transactionItemId: item.id },
        });

        for (const ledger of ledgers) {
          const stock = await em.findOne(InventoryStockOrmEntity, {
            where: { id: ledger.stockId },
          });

          if (!stock) continue;

          if (Number(ledger.quantity) > 0) {
            // Si fue entrada, verificar que no haya sido consumida por movimientos posteriores
            const consumptions = await em
              .createQueryBuilder(StockLedgerEntryOrmEntity, 'sle')
              .where('sle.stockId = :stockId', { stockId: ledger.stockId })
              .andWhere('sle.transactionItemId != :itemId', { itemId: item.id })
              .andWhere('sle.quantity < 0')
              .getCount();

            if (
              consumptions > 0 ||
              Number(stock.physicalQty) < Number(ledger.quantity)
            ) {
              throw new BadRequestException(
                `Operación denegada: El stock ingresado para ${item.skuSnapshot} ya fue consumido por movimientos o ventas posteriores.`,
              );
            }

            stock.physicalQty = Math.max(
              0,
              Number(stock.physicalQty) - Number(ledger.quantity),
            );
            stock.uomOriginalQty = Math.max(
              0,
              Number(stock.uomOriginalQty) - Number(ledger.quantity),
            );
            if (stock.physicalQty <= 0) stock.isDepleted = true;
            await em.save(InventoryStockOrmEntity, stock);
          } else if (Number(ledger.quantity) < 0) {
            // Si fue salida, restaurar la cantidad física disponible
            stock.physicalQty =
              Number(stock.physicalQty) + Math.abs(Number(ledger.quantity));
            stock.isDepleted = false;
            await em.save(InventoryStockOrmEntity, stock);
          }

          await em.remove(StockLedgerEntryOrmEntity, ledger);
        }
      }
    };

    if (externalEm) {
      await runner(externalEm);
    } else {
      await this.dataSource.transaction(async (em) => {
        await runner(em);
      });
    }
  }

  private async depleteFromOrigin(
    tx: InventoryTransaction,
    item: InventoryTransactionItem,
    em: EntityManager,
    userId?: string,
  ): Promise<ConsumedStockChunk[]> {
    const originWarehouseId = tx.originWarehouseId!;
    const chunks: ConsumedStockChunk[] = [];

    const qb = em
      .createQueryBuilder(InventoryStockOrmEntity, 's')
      .where('s.warehouseId = :warehouseId', { warehouseId: originWarehouseId })
      .andWhere('s.productId = :productId', { productId: item.productId })
      .andWhere('s.isDepleted = false')
      .andWhere('s.physicalQty - s.reservedQty > 0');

    if (item.batchNumber) {
      qb.andWhere('s.batchNumber = :batchNumber', {
        batchNumber: item.batchNumber,
      });
    }

    qb.orderBy('s.entryDate', 'ASC').addOrderBy('s.createdAt', 'ASC');

    const stocks = await qb.getMany();
    let remainingQty = Number(item.quantity);

    for (const stock of stocks) {
      const available = Number(stock.physicalQty) - Number(stock.reservedQty);
      if (available <= 0) continue;

      const qtyToTake = Math.min(remainingQty, available);
      let secQtyToTake: number | null = null;

      if (
        stock.secPhysicalQty !== null &&
        stock.secPhysicalQty !== undefined &&
        Number(stock.physicalQty) > 0
      ) {
        secQtyToTake =
          (qtyToTake / Number(stock.physicalQty)) *
          Number(stock.secPhysicalQty);
        secQtyToTake = Math.round(secQtyToTake * 10000) / 10000;
      }

      stock.physicalQty = Number(stock.physicalQty) - qtyToTake;
      if (secQtyToTake !== null && stock.secPhysicalQty !== null) {
        stock.secPhysicalQty = Math.max(
          0,
          Number(stock.secPhysicalQty) - secQtyToTake,
        );
      }

      if (stock.physicalQty <= 0) {
        stock.physicalQty = 0;
        stock.isDepleted = true;
      }

      await em.save(InventoryStockOrmEntity, stock);

      // Kárdex Salida
      const ledgerEntry = em.create(StockLedgerEntryOrmEntity, {
        transactionItemId: item.id,
        stockId: stock.id,
        quantity: -qtyToTake,
        secQuantity: secQtyToTake !== null ? -secQtyToTake : null,
        unitCost: Number(stock.unitCost),
        totalCost: -(qtyToTake * Number(stock.unitCost)),
        createdById: userId,
      });
      await em.save(StockLedgerEntryOrmEntity, ledgerEntry);

      chunks.push({
        batchNumber: stock.batchNumber || null,
        entryDate: stock.entryDate,
        unitCost: Number(stock.unitCost),
        currencyCode: stock.currencyCode || 'USD',
        quantity: qtyToTake,
        skuSnapshot: stock.skuSnapshot,
        productNameSnapshot: stock.productNameSnapshot,
        uomSymbol: stock.uomSymbol,
        uomOriginalQty: qtyToTake,
        secUomOriginalQty: secQtyToTake,
        secPhysicalQty: secQtyToTake,
        unitCostBase: Number(stock.unitCostBase),
        currencyCodeBase: stock.currencyCodeBase || 'USD',
        unitCostLocal: Number(stock.unitCostLocal),
        currencyCodeLocal: stock.currencyCodeLocal || 'VES',
        exchangeRateSnapshot: Number(stock.exchangeRateSnapshot || 1),
      });

      remainingQty -= qtyToTake;
      if (remainingQty <= 0) break;
    }

    if (remainingQty > 0) {
      throw new BadRequestException(
        `Stock insuficiente para el producto SKU ${item.skuSnapshot} en el almacén de origen. Solicitado: ${item.quantity}, Faltante: ${remainingQty}`,
      );
    }

    return chunks;
  }

  private async receiveInDestination(
    tx: InventoryTransaction,
    item: InventoryTransactionItem,
    chunks: ConsumedStockChunk[],
    em: EntityManager,
    userId?: string,
  ): Promise<void> {
    const destWarehouseId = tx.destWarehouseId!;

    for (const chunk of chunks) {
      const qb = em
        .createQueryBuilder(InventoryStockOrmEntity, 's')
        .where('s.warehouseId = :warehouseId', { warehouseId: destWarehouseId })
        .andWhere('s.productId = :productId', { productId: item.productId })
        .andWhere('s.entryDate = :entryDate', { entryDate: chunk.entryDate })
        .andWhere('s.unitCost = :unitCost', { unitCost: chunk.unitCost });

      if (chunk.batchNumber) {
        qb.andWhere('s.batchNumber = :batchNumber', {
          batchNumber: chunk.batchNumber,
        });
      } else {
        qb.andWhere('s.batchNumber IS NULL');
      }

      let stock = await qb.getOne();

      if (stock) {
        stock.physicalQty = Number(stock.physicalQty) + chunk.quantity;
        stock.uomOriginalQty = Number(stock.uomOriginalQty) + chunk.quantity;
        if (
          chunk.secPhysicalQty !== null &&
          chunk.secPhysicalQty !== undefined
        ) {
          stock.secPhysicalQty =
            Number(stock.secPhysicalQty || 0) + chunk.secPhysicalQty;
          stock.secUomOriginalQty =
            Number(stock.secUomOriginalQty || 0) + chunk.secPhysicalQty;
        }
        stock.isDepleted = false;
      } else {
        stock = em.create(InventoryStockOrmEntity, {
          warehouseId: destWarehouseId,
          productId: item.productId,
          variantId: item.variantId || null,
          skuSnapshot: chunk.skuSnapshot,
          productNameSnapshot: chunk.productNameSnapshot,
          batchNumber: chunk.batchNumber || null,
          entryDate: chunk.entryDate,
          uomOriginalQty: chunk.quantity,
          physicalQty: chunk.quantity,
          reservedQty: 0,
          uomSymbol: chunk.uomSymbol,
          secUomOriginalQty: chunk.secUomOriginalQty || null,
          secPhysicalQty: chunk.secPhysicalQty || null,
          secReservedQty: 0,
          secUomSymbol: item.secUomSymbol || null,
          unitCost: chunk.unitCost,
          currencyCode: chunk.currencyCode || 'USD',
          unitCostBase: chunk.unitCostBase,
          currencyCodeBase: chunk.currencyCodeBase || 'USD',
          unitCostLocal: chunk.unitCostLocal,
          currencyCodeLocal: chunk.currencyCodeLocal || 'VES',
          exchangeRateSnapshot: chunk.exchangeRateSnapshot || 1.0,
          isDepleted: false,
          createdById: userId,
        });
      }

      const savedStock = await em.save(InventoryStockOrmEntity, stock);

      // Kárdex Entrada
      const ledgerEntry = em.create(StockLedgerEntryOrmEntity, {
        transactionItemId: item.id,
        stockId: savedStock.id,
        quantity: chunk.quantity,
        secQuantity: chunk.secPhysicalQty ?? null,
        unitCost: chunk.unitCost,
        totalCost: chunk.quantity * chunk.unitCost,
        createdById: userId,
      });
      await em.save(StockLedgerEntryOrmEntity, ledgerEntry);
    }
  }
}
