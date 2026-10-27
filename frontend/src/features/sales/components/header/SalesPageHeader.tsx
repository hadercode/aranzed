import {
  ShoppingBag,
  Plus,
  FileSpreadsheet,
  FileText,
  CreditCard,
} from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Button } from '@/shared/components/ui/Button';
import { useSalesContext } from '../../context';

export function SalesPageHeader() {
  const {
    handleCreateSale,
    handleCreateQuotation,
    handleExportExcel,
    handleExportPdf,
    handleGoToPayments,
    handleGoToNewPayment,
  } = useSalesContext();

  return (
    <PageHeader
      title="Ventas y Cotizaciones"
      description="Registro comercial bimoneda, cotizaciones para clientes y facturación directa con eventos desacoplados para inventario."
      icon={<ShoppingBag className="w-6 h-6" />}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Ir a Cobros y Pagos */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoToPayments}
          leftIcon={<CreditCard className="w-4 h-4 text-[#22B2B8]" />}
        >
          Cobros y Pagos
        </Button>

        {/* Registrar Cobro General */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGoToNewPayment}
          leftIcon={<Plus className="w-4 h-4 text-[#F43F5E]" />}
        >
          Registrar Cobro
        </Button>

        {/* Exportar Excel */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#22B2B8]" />}
        >
          Excel
        </Button>

        {/* Reporte PDF */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPdf}
          leftIcon={<FileText className="w-4 h-4 text-[#F43F5E]" />}
        >
          PDF
        </Button>

        {/* Nueva Cotización */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCreateQuotation}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Cotización
        </Button>

        {/* Nueva Venta Directa */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateSale}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nueva Venta
        </Button>
      </div>
    </PageHeader>
  );
}

export default SalesPageHeader;
