import { ApiClient, API_BASE_URL } from '@/lib/api-client';
import type {
  BulkImportValidationResult,
  BulkImportSummary,
  BulkImportItemValidation,
} from '../types';

export const productsImportService = {
  /**
   * Descarga la plantilla oficial en Excel (.xlsx) con los encabezados requeridos,
   * formato optimizado, filas de muestra y catálogos de referencia actualizados.
   */
  async downloadTemplate(): Promise<void> {
    const token = ApiClient.getToken();
    const res = await fetch(`${API_BASE_URL}/catalog/products/import/template`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error('Error al descargar la plantilla de artículos');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla_articulos_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Envía el archivo Excel (.xlsx) para ser parseado y validado en el servidor.
   * Retorna el informe exhaustivo fila por fila con conteo de válidos, duplicados y errores.
   */
  async validateFile(file: File): Promise<BulkImportValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    return await ApiClient.post<BulkImportValidationResult>(
      '/catalog/products/import/validate',
      formData,
    );
  },

  /**
   * Ejecuta la persistencia masiva en base de datos de los artículos validados.
   */
  async executeImport(items: BulkImportItemValidation[]): Promise<BulkImportSummary> {
    return await ApiClient.post<BulkImportSummary>(
      '/catalog/products/import/execute',
      { items },
    );
  },
};

