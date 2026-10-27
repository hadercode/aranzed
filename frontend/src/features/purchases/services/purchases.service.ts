import { ApiClient } from '@/lib/api-client';
import type { Purchase, PurchaseStatus } from '../types';
import type { PurchasePayload } from './purchase.mapper';

export interface PurchasesListResponse {
  purchases: Purchase[];
  total: number;
}

export const purchasesService = {
  /**
   * Obtiene la lista de compras registradas
   */
  async getAll(): Promise<Purchase[]> {
    const res = await ApiClient.get<PurchasesListResponse | Purchase[]>('/purchases');
    if (Array.isArray(res)) {
      return res;
    }
    return res?.purchases || [];
  },

  /**
   * Obtiene el detalle de una compra por su identificador único
   */
  async getById(id: string): Promise<Purchase> {
    return ApiClient.get<Purchase>(`/purchases/${id}`);
  },

  /**
   * Registra una nueva compra en el backend
   */
  async create(payload: PurchasePayload): Promise<Purchase> {
    return ApiClient.post<Purchase>('/purchases', payload);
  },

  /**
   * Actualiza los datos de una compra existente
   */
  async update(id: string, payload: PurchasePayload): Promise<Purchase> {
    return ApiClient.put<Purchase>(`/purchases/${id}`, payload);
  },

  /**
   * Cambia el estado de la compra (ej. DRAFT -> COMPLETED)
   */
  async updateStatus(id: string, status: PurchaseStatus): Promise<Purchase> {
    return ApiClient.patch<Purchase>(`/purchases/${id}/status`, { status });
  },

  /**
   * Elimina un registro de compra (borrador)
   */
  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/purchases/${id}`);
  },
};
