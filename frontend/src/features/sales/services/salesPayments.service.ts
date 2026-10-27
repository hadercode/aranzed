import { ApiClient } from '@/lib/api-client';
import type {
  SalePayment,
  SalePaymentFilters,
  PendingSaleForPayment,
  CreateSalePaymentPayload,
  CloseSaleManuallyPayload,
  Sale,
} from '../types';

export interface SalePaymentsListResponse {
  payments: SalePayment[];
  total: number;
}

export const salesPaymentsService = {
  /**
   * Obtiene la lista de cobros y pagos con filtros
   */
  async getAll(filters?: SalePaymentFilters): Promise<SalePaymentsListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.customerName) params.append('customerName', filters.customerName);
    if (filters?.paymentMethod && filters.paymentMethod !== 'ALL')
      params.append('paymentMethod', filters.paymentMethod);
    if (filters?.status && filters.status !== 'ALL')
      params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await ApiClient.get<SalePaymentsListResponse>(
      `/sales/payments${queryString}`,
    );
    return res;
  },

  /**
   * Obtiene el detalle de un cobro por su ID
   */
  async getById(id: string): Promise<SalePayment> {
    return ApiClient.get<SalePayment>(`/sales/payments/${id}`);
  },

  /**
   * Obtiene las ventas pendientes para cruzar cobros (opcionalmente filtradas por cliente)
   */
  async getPendingSales(customerName?: string): Promise<PendingSaleForPayment[]> {
    const params = new URLSearchParams();
    if (customerName) params.append('customerName', customerName);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return ApiClient.get<PendingSaleForPayment[]>(
      `/sales/payments/pending-sales${queryString}`,
    );
  },

  /**
   * Obtiene los cobros asociados a una venta específica
   */
  async getBySaleId(saleId: string): Promise<SalePayment[]> {
    return ApiClient.get<SalePayment[]>(`/sales/payments/by-sale/${saleId}`);
  },

  /**
   * Registra un nuevo cobro y lo distribuye a las ventas asignadas
   */
  async create(data: CreateSalePaymentPayload): Promise<SalePayment> {
    return ApiClient.post<SalePayment>('/sales/payments', data);
  },

  /**
   * Sube una imagen o documento de comprobante de pago
   */
  async uploadReceipt(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return ApiClient.post<{ url: string; filename: string }>(
      '/sales/payments/upload-receipt',
      formData,
    );
  },

  /**
   * Cierra manualmente una venta si tiene una diferencia mínima o saldo de centavos
   */
  async closeSaleManually(
    saleId: string,
    data: CloseSaleManuallyPayload,
  ): Promise<Sale> {
    return ApiClient.patch<Sale>(`/sales/payments/close-sale/${saleId}`, data);
  },

  /**
   * Anula un cobro y revierte los saldos en las ventas cruzadas
   */
  async cancel(id: string, reason?: string): Promise<SalePayment> {
    return ApiClient.patch<SalePayment>(`/sales/payments/${id}/cancel`, {
      reason,
    });
  },
};
