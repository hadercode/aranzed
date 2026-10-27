import { ShoppingBag, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { usePurchasesContext } from "../../context";
import { useCurrencyStore } from "@/shared/hooks/store";
import { StatCard } from "@/shared/components/ui";

export function PurchasesStatsCards() {
  const { stats } = usePurchasesContext();
  const { functionalSymbol } = useCurrencyStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Registros"
        value={stats.totalCount}
        description="Compras registradas históricas"
        icon={<ShoppingBag className="w-5 h-5" />}
        color="blue"
      />

      <StatCard
        title="Total Invertido"
        value={`${functionalSymbol} ${stats.totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
        description={`${stats.completedCount} compras con stock emitido`}
        icon={<CheckCircle2 className="w-5 h-5" />}
        color="emerald"
      />

      <StatCard
        title="En Borrador"
        value={stats.draftCount}
        description="Pendientes por completar e ingresar a stock"
        icon={<Clock className="w-5 h-5" />}
        color="amber"
      />

      <StatCard
        title="Ticket Promedio"
        value={`${functionalSymbol} ${stats.averageTicket.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
        description="Costo promedio por compra completada"
        icon={<DollarSign className="w-5 h-5" />}
        color="purple"
      />
    </div>
  );
}

export default PurchasesStatsCards;
