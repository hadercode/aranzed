import { ApiClient } from '@/lib/api-client';
import type {
  InventoryStock,
  StockLedgerEntry,
  InventoryAdjustmentReport,
  CreateStockReservationDto,
  StockFilters,
} from '../types';

export const stocksService = {
  async getStocks(filters: StockFilters = {}): Promise<InventoryStock[]> {
    const params = new URLSearchParams();
    if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.search) params.append('search', filters.search);
    if (filters.excludeDepleted !== undefined) {
      params.append('excludeDepleted', String(filters.excludeDepleted));
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    return ApiClient.get<InventoryStock[]>(`/inventory/stocks${qs}`);
  },

  async getLedger(filters?: { stockId?: string; transactionItemId?: string }): Promise<StockLedgerEntry[]> {
    const params = new URLSearchParams();
    if (filters?.stockId) params.append('stockId', filters.stockId);
    if (filters?.transactionItemId) params.append('transactionItemId', filters.transactionItemId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return ApiClient.get<StockLedgerEntry[]>(`/inventory/stocks/ledger${qs}`);
  },

  async getAdjustmentsReport(): Promise<InventoryAdjustmentReport[]> {
    return ApiClient.get<InventoryAdjustmentReport[]>('/inventory/stocks/adjustments-report');
  },

  async createReservation(payload: CreateStockReservationDto): Promise<any> {
    return ApiClient.post('/inventory/stocks/reservations', payload);
  },

  async releaseReservation(reservationId: string): Promise<void> {
    return ApiClient.post(`/inventory/stocks/reservations/${reservationId}/release`, {});
  },
};
