import { ShoppingBag, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { StatCard } from '@/shared/components/ui/StatCard';
import { useSalesContext } from '../../context';

export function SalesStatsCards() {
  const { stats } = useSalesContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Ventas Completadas"
        value={stats.completedSalesCount}
        description={`${stats.totalSalesCount} ventas registradas en total`}
        icon={<CheckCircle2 className="w-5 h-5" />}
        color="cyan"
      />

      <StatCard
        title="Cotizaciones Activas"
        value={stats.totalQuotationsCount}
        description="Presupuestos pendientes de conversión"
        icon={<FileText className="w-5 h-5" />}
        color="fuchsia"
      />

      <StatCard
        title="Total Ingresos (USD)"
        value={`$${stats.totalRevenueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        description={`Ticket promedio: $${stats.averageTicketUSD.toFixed(2)}`}
        icon={<DollarSign className="w-5 h-5" />}
        color="purple"
      />

      <StatCard
        title="Total Ingresos (VES)"
        value={`Bs. ${stats.totalRevenueLocal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        description="Valorizado a tasa del día"
        icon={<ShoppingBag className="w-5 h-5" />}
        color="yellow"
      />
    </div>
  );
}

export default SalesStatsCards;
