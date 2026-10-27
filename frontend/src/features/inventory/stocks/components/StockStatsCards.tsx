import { StatCard } from '@/shared/components/ui';

interface StockStatsCardsProps {
  stats: {
    totalItems: number;
    totalPhysicalUnits: number;
    totalReservedUnits: number;
    totalAvailableUnits: number;
    totalValuationUSD: number;
    totalValuationLocal: number;
  };
}

export function StockStatsCards({ stats }: StockStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Ítems en Stock"
        value={stats.totalItems.toLocaleString()}
        description="Capas activas en almacén"
        color="blue"
      />
      <StatCard
        title="Unidades Físicas"
        value={stats.totalPhysicalUnits.toFixed(2)}
        description={`Reservadas: ${stats.totalReservedUnits.toFixed(2)}`}
        color="purple"
      />
      <StatCard
        title="Disponibles para Venta"
        value={stats.totalAvailableUnits.toFixed(2)}
        description="Listas para facturación"
        color="emerald"
      />
      <StatCard
        title="Valoración Total"
        value={`$${stats.totalValuationUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        description={`Bs. ${stats.totalValuationLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        color="teal"
      />
    </div>
  );
}
