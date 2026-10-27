import { Injectable, BadRequestException } from '@nestjs/common';
import { ISaleInventoryPort } from '@/sales/application/ports/sale-inventory.port';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';
import { WarehousesService } from '@/inventory/warehouses/application/services/warehouses.service';

/**
 * Adaptador de infraestructura que implementa ISaleInventoryPort.
 * Aísla el módulo de ventas de las dependencias concretas de inventario y almacenes.
 */
@Injectable()
export class InventoryStockAdapter implements ISaleInventoryPort {
  constructor(
    private readonly inventoryStocksService: InventoryStocksService,
    private readonly warehousesService: WarehousesService,
  ) {}

  async getAvailableStock(
    productId: string,
    warehouseId: string,
  ): Promise<number> {
    return this.inventoryStocksService.getAvailableStock(
      productId,
      warehouseId,
    );
  }

  async resolveWarehouseId(warehouseId?: string | null): Promise<string> {
    if (warehouseId) {
      return warehouseId;
    }
    const warehouses = await this.warehousesService.findAll();
    const active = warehouses.filter((w) => w.isActive);
    const salesWh = active.find((w) => w.isSalesWarehouse);
    const resolved = salesWh?.id || active[0]?.id;
    if (!resolved) {
      throw new BadRequestException(
        'No existe ningún almacén activo configurado en el sistema para despachar inventario.',
      );
    }
    return resolved;
  }
}
