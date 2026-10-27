import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  SaleCompletionService,
  SaleItemsService,
} from '@/sales/application/services';
import { UpdateSaleStatusCommand } from './update-sale-status.command';

@Injectable()
export class UpdateSaleStatusUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleItemsService: SaleItemsService,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: UpdateSaleStatusCommand): Promise<Sale> {
    const sale = await this.saleRepository.findById(command.id);
    if (!sale) {
      throw new NotFoundException(
        `La venta con ID "${command.id}" no fue encontrada`,
      );
    }

    if (sale.status === command.status) {
      return sale;
    }

    const previousStatus = sale.status;

    // Regla de dominio: transición controlada por máquina de estados del agregado
    if (command.status === SaleStatus.CANCELLED) {
      sale.cancel(command.cancelReason);
    } else {
      sale.transitionTo(command.status);
    }

    // Si transiciona hacia COMPLETED: resolver almacén y validar existencias físicas antes de persistir
    if (
      previousStatus !== SaleStatus.COMPLETED &&
      command.status === SaleStatus.COMPLETED
    ) {
      sale.warehouseId = await this.saleItemsService.resolveWarehouseId(
        sale.warehouseId,
      );
      await this.saleItemsService.validateStockAvailability(
        sale.items,
        sale.warehouseId,
      );
    }

    const saved = await this.saleRepository.save(sale);

    // 1. Si transitó hacia COMPLETED: emitir evento desacoplado para inventario
    if (
      previousStatus !== SaleStatus.COMPLETED &&
      saved.status === SaleStatus.COMPLETED
    ) {
      await this.saleCompletionService.completeSale(saved);
    }

    // 2. Si transitó hacia CANCELLED: emitir evento de anulación
    if (
      previousStatus !== SaleStatus.CANCELLED &&
      saved.status === SaleStatus.CANCELLED
    ) {
      await this.saleCompletionService.publishSaleCancelled(
        saved,
        command.cancelReason,
        command.userId,
      );
    }

    return saved;
  }
}
