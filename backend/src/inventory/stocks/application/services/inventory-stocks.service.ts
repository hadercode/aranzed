import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryStockOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/inventory-stock.orm-entity';
import { StockReservationOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/stock-reservation.orm-entity';
import { StockLedgerEntryOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/stock-ledger-entry.orm-entity';
import { InventoryAdjustmentReportOrmEntity } from '@/inventory/stocks/infrastructure/persistence/typeorm/entities/inventory-adjustment-report.orm-entity';
import { StockFiltersDto } from '../../presentation/http/dto/stock-filters.dto';
import { CreateStockReservationDto } from '../../presentation/http/dto/create-stock-reservation.dto';
import { StockReservationStatus } from '@/inventory/stocks/domain/enums/stock-reservation-status.enum';

@Injectable()
export class InventoryStocksService {
  constructor(
    @InjectRepository(InventoryStockOrmEntity)
    private readonly stockRepo: Repository<InventoryStockOrmEntity>,
    @InjectRepository(StockReservationOrmEntity)
    private readonly reservationRepo: Repository<StockReservationOrmEntity>,
    @InjectRepository(StockLedgerEntryOrmEntity)
    private readonly ledgerRepo: Repository<StockLedgerEntryOrmEntity>,
    @InjectRepository(InventoryAdjustmentReportOrmEntity)
    private readonly reportRepo: Repository<InventoryAdjustmentReportOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: StockFiltersDto): Promise<any[]> {
    const qb = this.stockRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.warehouse', 'w')
      .leftJoinAndSelect('s.product', 'p');

    if (filters.warehouseId) {
      qb.andWhere('s.warehouseId = :warehouseId', {
        warehouseId: filters.warehouseId,
      });
    }

    if (filters.productId) {
      qb.andWhere('s.productId = :productId', { productId: filters.productId });
    }

    if (filters.search) {
      qb.andWhere(
        '(s.skuSnapshot ILIKE :search OR s.productNameSnapshot ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.excludeDepleted !== false) {
      qb.andWhere('s.isDepleted = false').andWhere('s.physicalQty > 0');
    }

    qb.orderBy('s.productNameSnapshot', 'ASC').addOrderBy('s.entryDate', 'ASC');

    const stocks = await qb.getMany();

    return stocks.map((s) => ({
      ...s,
      availableQty: Math.max(0, Number(s.physicalQty) - Number(s.reservedQty)),
      secAvailableQty:
        s.secPhysicalQty !== null && s.secPhysicalQty !== undefined
          ? Math.max(
              0,
              Number(s.secPhysicalQty) - Number(s.secReservedQty || 0),
            )
          : null,
    }));
  }

  async getAvailableStock(
    productId: string,
    warehouseId?: string | null,
  ): Promise<number> {
    const qb = this.stockRepo
      .createQueryBuilder('s')
      .select('COALESCE(SUM(s.physicalQty - s.reservedQty), 0)', 'available')
      .where('s.productId = :productId', { productId })
      .andWhere('s.isDepleted = false');

    if (warehouseId) {
      qb.andWhere('s.warehouseId = :warehouseId', { warehouseId });
    }

    const raw = await qb.getRawOne<{ available: string | number }>();
    return Math.max(0, parseFloat(String(raw?.available || 0)));
  }

  async findLedger(filters?: {
    stockId?: string;
    transactionItemId?: string;
  }): Promise<any[]> {
    const qb = this.ledgerRepo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.transactionItem', 'ti')
      .leftJoinAndSelect('ti.transaction', 't')
      .leftJoinAndSelect('l.stock', 's')
      .leftJoinAndSelect('s.warehouse', 'w');

    if (filters?.stockId) {
      qb.andWhere('l.stockId = :stockId', { stockId: filters.stockId });
    }

    if (filters?.transactionItemId) {
      qb.andWhere('l.transactionItemId = :transactionItemId', {
        transactionItemId: filters.transactionItemId,
      });
    }

    qb.orderBy('l.createdAt', 'ASC');
    const entries = await qb.getMany();

    // Calcular saldos acumulados por capa de stock
    const runningBalances = new Map<string, number>();

    const enriched = entries.map((entry) => {
      const currentStockId = entry.stockId;
      const prevBalance = runningBalances.get(currentStockId) || 0;
      const qty = Number(entry.quantity || 0);
      const newBalance = Number((prevBalance + qty).toFixed(5));
      runningBalances.set(currentStockId, newBalance);

      return {
        ...entry,
        movementQty: qty,
        remainingQty: newBalance,
        remainingReservedQty: Number(entry.stock?.reservedQty || 0),
        unitCost: Number(entry.unitCost || 0),
        totalCost: Number(entry.totalCost || 0),
      };
    });

    // Retornar en orden cronológico descendente (el más reciente arriba)
    return enriched.reverse();
  }

  async getAdjustmentsReport(): Promise<InventoryAdjustmentReportOrmEntity[]> {
    return this.reportRepo.find({
      order: { movementDate: 'DESC' },
    });
  }

  async createReservation(
    dto: CreateStockReservationDto,
    userId?: string,
  ): Promise<StockReservationOrmEntity> {
    return this.dataSource.transaction(async (em) => {
      const stock = await em.findOne(InventoryStockOrmEntity, {
        where: { id: dto.stockId },
      });
      if (!stock) {
        throw new NotFoundException(
          `Stock con ID ${dto.stockId} no encontrado`,
        );
      }

      const available = Number(stock.physicalQty) - Number(stock.reservedQty);
      if (dto.reservedQty > available) {
        throw new BadRequestException(
          `Stock insuficiente para reservar. Disponible: ${available}, Solicitado: ${dto.reservedQty}`,
        );
      }

      // Actualizar reservedQty en stock
      stock.reservedQty = Number(stock.reservedQty) + dto.reservedQty;
      if (dto.secReservedQty && stock.secReservedQty !== null) {
        stock.secReservedQty =
          Number(stock.secReservedQty || 0) + dto.secReservedQty;
      }
      await em.save(InventoryStockOrmEntity, stock);

      const reservation = em.create(StockReservationOrmEntity, {
        stockId: dto.stockId,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        referenceItemId: dto.referenceItemId,
        reservedQty: dto.reservedQty,
        secReservedQty: dto.secReservedQty,
        status: StockReservationStatus.ACTIVE,
        createdById: userId,
      });

      return em.save(StockReservationOrmEntity, reservation);
    });
  }

  async releaseReservation(reservationId: string): Promise<void> {
    return this.dataSource.transaction(async (em) => {
      const reservation = await em.findOne(StockReservationOrmEntity, {
        where: { id: reservationId },
      });
      if (!reservation) {
        throw new NotFoundException(
          `Reservación con ID ${reservationId} no encontrada`,
        );
      }

      if (reservation.status !== StockReservationStatus.ACTIVE) {
        return; // ya no está activa
      }

      const stock = await em.findOne(InventoryStockOrmEntity, {
        where: { id: reservation.stockId },
      });
      if (stock) {
        stock.reservedQty = Math.max(
          0,
          Number(stock.reservedQty) - Number(reservation.reservedQty),
        );
        if (reservation.secReservedQty && stock.secReservedQty !== null) {
          stock.secReservedQty = Math.max(
            0,
            Number(stock.secReservedQty || 0) -
              Number(reservation.secReservedQty),
          );
        }
        await em.save(InventoryStockOrmEntity, stock);
      }

      reservation.status = StockReservationStatus.CANCELLED;
      await em.save(StockReservationOrmEntity, reservation);
    });
  }
}
