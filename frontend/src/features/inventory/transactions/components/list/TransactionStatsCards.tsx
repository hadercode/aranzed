import {
  Layers,
  CheckCircle2,
  ArrowDownCircle,
  ArrowLeftRight,
} from "lucide-react";
import { StatCard, type StatCardProps } from "@/shared/components/ui";
import type { TransactionsStatsSummary } from "../../hooks";

export interface TransactionStatsCardsProps {
  stats: TransactionsStatsSummary;
  className?: string;
}

export function TransactionStatsCards({
  stats,
  className = "",
}: TransactionStatsCardsProps) {
  const statsCards: StatCardProps[] = [
    {
      title: "Total Movimientos",
      value: stats.totalCount,
      description: "Histórico de transacciones registradas",
      icon: <Layers className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Impacto Físico",
      value: stats.completedCount,
      description: "Movimientos con stock consolidado",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: "Entradas (Recepciones)",
      value: stats.receptionCount,
      description: "Ingresos por compras o saldos iniciales",
      icon: <ArrowDownCircle className="w-5 h-5" />,
      color: "teal",
    },
    {
      title: "Salidas y Traslados",
      value: stats.issueCount + stats.transferCount,
      description: `${stats.issueCount} salidas directas y ${stats.transferCount} transferencias`,
      icon: <ArrowLeftRight className="w-5 h-5" />,
      color: "purple",
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {statsCards.map((statCard, index) => (
        <StatCard
          key={index}
          title={statCard.title}
          value={statCard.value}
          description={statCard.description}
          icon={statCard.icon}
          color={statCard.color}
        />
      ))}
    </div>
  );
}

export default TransactionStatsCards;
