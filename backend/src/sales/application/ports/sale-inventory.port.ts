export const SALE_INVENTORY_PORT_TOKEN = 'ISaleInventoryPort';

export interface ISaleInventoryPort {
  /**
   * Obtiene el stock disponible físico (cantidad total - reservada) para un producto en un almacén.
   */
  getAvailableStock(productId: string, warehouseId: string): Promise<number>;

  /**
   * Resuelve el ID del almacén por defecto (ej. almacén de ventas activo) si no se especifica uno.
   */
  resolveWarehouseId(warehouseId?: string | null): Promise<string>;
}
