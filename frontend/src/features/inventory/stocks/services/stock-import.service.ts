import { ApiClient, API_BASE_URL } from '@/lib/api-client';
import type {
  BulkStockImportValidationResult,
  BulkStockImportSummary,
  BulkStockImportItemValidation,
} from '../types';

export const stockImportService = {
  /**
   * Descarga la plantilla oficial en Excel (.xlsx) con todos los artículos
   * del catálogo que gestionan inventario ya pre-cargados y la lista de almacenes.
   */
  async downloadTemplate(): Promise<void> {
    const token = ApiClient.getToken();
    const res = await fetch(`${API_BASE_URL}/inventory/stocks/import/template`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error('Error al descargar la plantilla de saldos iniciales');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla_saldos_iniciales_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Valida el archivo Excel de saldos iniciales en el backend,
   * verificando que los artículos y almacenes existan en la base de datos.
   */
  async validateFile(file: File): Promise<BulkStockImportValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    return await ApiClient.post<BulkStockImportValidationResult>(
      '/inventory/stocks/import/validate',
      formData,
    );
  },

  /**
   * Ejecuta el ingreso de los saldos iniciales en el inventario.
   */
  async executeImport(
    items: BulkStockImportItemValidation[],
  ): Promise<BulkStockImportSummary> {
    return await ApiClient.post<BulkStockImportSummary>(
      '/inventory/stocks/import/execute',
      { items },
    );
  },
};

