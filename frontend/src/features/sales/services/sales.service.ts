import { ApiClient, API_BASE_URL } from '@/lib/api-client';
import type { Sale, SaleFilters, SalePaidStatus, SaleStats, SaleStatus } from '../types';
import type { SaleFormData } from '../schemas';

export interface SalesListResponse {
  sales: Sale[];
  total: number;
}

const BASE_URL = API_BASE_URL;

function getAuthToken(): string | null {
  return ApiClient.getToken();
}

export const salesService = {
  /**
   * Obtiene la lista de ventas y cotizaciones con filtros aplicados
   */
  async getAll(filters?: SaleFilters): Promise<SalesListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.saleType && filters.saleType !== 'ALL') params.append('saleType', filters.saleType);
    if (filters?.paymentTerm && filters.paymentTerm !== 'ALL') params.append('paymentTerm', filters.paymentTerm);
    if (filters?.paidStatus && filters.paidStatus !== 'ALL') params.append('paidStatus', filters.paidStatus);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.customerName) params.append('customerName', filters.customerName);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await ApiClient.get<SalesListResponse | Sale[]>(`/sales${queryString}`);

    if (Array.isArray(res)) {
      return { sales: res, total: res.length };
    }
    return { sales: res?.sales || [], total: res?.total || 0 };
  },

  /**
   * Obtiene el detalle de una venta por su ID
   */
  async getById(id: string): Promise<Sale> {
    return ApiClient.get<Sale>(`/sales/${id}`);
  },

  /**
   * Obtiene las estadísticas y métricas acumuladas de ventas
   */
  async getStats(filters?: SaleFilters): Promise<SaleStats> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return ApiClient.get<SaleStats>(`/sales/stats${queryString}`);
  },

  /**
   * Registra una nueva venta o cotización
   */
  async create(data: SaleFormData): Promise<Sale> {
    return ApiClient.post<Sale>('/sales', data);
  },

  /**
   * Actualiza una venta o cotización existente
   */
  async update(id: string, data: SaleFormData): Promise<Sale> {
    return ApiClient.put<Sale>(`/sales/${id}`, data);
  },

  /**
   * Cambia el estado del documento (ej. DRAFT -> COMPLETED o CANCELLED)
   */
  async updateStatus(id: string, status: SaleStatus, cancelReason?: string): Promise<Sale> {
    return ApiClient.patch<Sale>(`/sales/${id}/status`, { status, cancelReason });
  },

  /**
   * Actualiza el estado de cobro/pago (PENDIENTE, ABONADO, PAGADO)
   */
  async updatePaidStatus(id: string, paidStatus: SalePaidStatus): Promise<Sale> {
    return ApiClient.patch<Sale>(`/sales/${id}/paid-status`, { paidStatus });
  },

  /**
   * Convierte una cotización en una venta directa formal
   */
  async convertQuotation(id: string): Promise<Sale> {
    return ApiClient.post<Sale>(`/sales/${id}/convert`, {});
  },

  /**
   * Elimina un registro de venta (en borrador o cancelado)
   */
  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/sales/${id}`);
  },

  /**
   * Descarga el reporte consolidado en formato Excel (.xlsx)
   */
  async exportExcel(filters?: SaleFilters): Promise<void> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.saleType && filters.saleType !== 'ALL') params.append('saleType', filters.saleType);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/sales/export/excel?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Error al descargar el reporte Excel');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Descarga o abre el reporte consolidado en PDF
   */
  async exportPdf(filters?: SaleFilters): Promise<void> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.saleType && filters.saleType !== 'ALL') params.append('saleType', filters.saleType);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/sales/export/pdf?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Error al descargar el reporte PDF');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  /**
   * Abre o descarga el comprobante en PDF de una venta/cotización específica
   */
  async getSalePdfBlobUrl(id: string): Promise<string> {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/sales/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Error al generar el comprobante PDF');

    const blob = await res.blob();
    return window.URL.createObjectURL(blob);
  },
};
