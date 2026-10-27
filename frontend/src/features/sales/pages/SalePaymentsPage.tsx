import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Button } from '@/shared/components/ui/Button';
import { useSalePaymentsPage } from '../hooks/logic/useSalePaymentsPage';
import {
  SalePaymentsStatsCards,
  SalePaymentsFilterBar,
  SalePaymentsTable,
  SalePaymentsDialogs,
} from '../components/payments/list';

export function SalePaymentsPage() {
  const navigate = useNavigate();
  const page = useSalePaymentsPage();

  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Cabecera Principal */}
      <PageHeader
        title="Historial de Cobros y Pagos"
        description="Gestiona y audita los pagos bancarios y transferencias registrados y cruzados contra facturas de venta."
        icon={<CreditCard className="w-6 h-6 text-emerald-600" />}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sales')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver a Ventas
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/sales/payments/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Cobro Cruzado
          </Button>
        </div>
      </PageHeader>

      {/* Tarjetas de Métricas KPI */}
      <SalePaymentsStatsCards stats={page.stats} />

      {/* Barra de Filtros */}
      <SalePaymentsFilterBar
        searchTerm={page.searchTerm}
        onSearchChange={page.setSearchTerm}
        methodFilter={page.methodFilter}
        onMethodChange={page.setMethodFilter}
        statusFilter={page.statusFilter}
        onStatusChange={page.setStatusFilter}
        startDate={page.startDate}
        onStartDateChange={page.setStartDate}
        endDate={page.endDate}
        onEndDateChange={page.setEndDate}
        onClearFilters={page.handleClearFilters}
      />

      {/* Tabla de Cobros */}
      <SalePaymentsTable
        payments={page.payments}
        isLoading={page.isLoading}
        total={page.total}
        onOpenReceipt={page.handleOpenReceipt}
        onOpenCancel={page.handleOpenCancel}
      />

      {/* Diálogos y Modales (Cancelación y Visor de Recibo) */}
      <SalePaymentsDialogs
        cancelTarget={page.cancelTarget}
        cancelReason={page.cancelReason}
        onCancelReasonChange={page.setCancelReason}
        isCancelling={page.isCancelling}
        actionError={page.actionError}
        onCloseCancel={page.handleCloseCancel}
        onConfirmCancel={page.handleConfirmCancel}
        viewerReceiptUrl={page.viewerReceiptUrl}
        onCloseReceipt={page.handleCloseReceipt}
      />
    </div>
  );
}

export default SalePaymentsPage;
