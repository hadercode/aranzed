import { salesService } from '../../services';
import type { Sale, SaleFilters } from '../../types';

export function useSalesPageOperations({
  filters,
  setActionError,
}: {
  filters: SaleFilters;
  setActionError: (msg: string) => void;
}) {
  const handleExportExcel = async () => {
    try {
      await salesService.exportExcel(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError('Error al exportar a Excel: ' + msg);
    }
  };

  const handleExportPdf = async () => {
    try {
      await salesService.exportPdf(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError('Error al exportar a PDF: ' + msg);
    }
  };

  const handlePrintSale = async (sale: Sale) => {
    try {
      const url = await salesService.getSalePdfBlobUrl(sale.id);
      window.open(url, '_blank');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError('Error al generar el comprobante PDF: ' + msg);
    }
  };

  return {
    handleExportExcel,
    handleExportPdf,
    handlePrintSale,
  };
}

