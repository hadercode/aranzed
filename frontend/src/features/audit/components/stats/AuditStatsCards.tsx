import { Activity, Clock, Layers, Database, XCircle, AlertCircle } from 'lucide-react';
import type { AuditStats } from '../../types/audit';
import { useAuditContext } from '../../context';
import { AuditStatCard } from './AuditStatCard';

interface AuditStatsCardsProps {
  stats?: AuditStats;
}

export function AuditStatsCards({ stats: propStats }: AuditStatsCardsProps) {
  const context = useAuditContext();
  const stats = propStats || context.stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <AuditStatCard
        title="Total Acciones"
        value={stats.total}
        subtitle="Historial acumulado"
        valueClassName="text-[#22B2B8] dark:text-[#38D5DB]"
        icon={<Activity className="w-4 h-4 text-[#22B2B8]" />}
      />

      <AuditStatCard
        title="Acciones Hoy"
        value={stats.todayCount}
        subtitle="Últimas 24 horas"
        valueClassName="text-[#8B5CF6] dark:text-[#A78BFA]"
        icon={<Clock className="w-4 h-4 text-[#8B5CF6]" />}
      />

      <AuditStatCard
        title="Modificaciones"
        value={stats.updates}
        subtitle="Cambios con historial"
        valueClassName="text-[#F97316] dark:text-[#FB923C]"
        icon={<Layers className="w-4 h-4 text-[#F97316]" />}
      />

      <AuditStatCard
        title="Creaciones"
        value={stats.creates}
        subtitle="Nuevos registros"
        valueClassName="text-[#22B2B8] dark:text-[#38D5DB]"
        icon={<Database className="w-4 h-4 text-[#22B2B8]" />}
      />

      <AuditStatCard
        title="Eliminaciones"
        value={stats.deletes}
        subtitle="Registros borrados"
        valueClassName="text-[#F43F5E] dark:text-[#FB7185]"
        icon={<XCircle className="w-4 h-4 text-[#F43F5E]" />}
      />

      <AuditStatCard
        title="Fallidas / Error"
        value={stats.failed}
        subtitle="Intentos con error"
        valueClassName="text-[#F59E0B] dark:text-[#FBBF24]"
        icon={<AlertCircle className="w-4 h-4 text-[#F59E0B]" />}
      />
    </div>
  );
}

export default AuditStatsCards;
