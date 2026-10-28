import { ApiClient } from '@/lib/api-client';
import type { DashboardSummaryResponse } from '../types';

export const dashboardService = {
  /**
   * Obtiene el resumen consolidado del dashboard en tiempo real desde la base de datos
   */
  async getSummary(): Promise<DashboardSummaryResponse> {
    return ApiClient.get<DashboardSummaryResponse>('/dashboard/summary');
  },
};
