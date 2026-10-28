import { AlertCircle, RefreshCw } from "lucide-react";
import {
  DashboardHeader,
  DashboardQuickActions,
  MetricCard,
  TutorialSection,
  DashboardActivityTable,
} from "../components";
import { useDashboardData } from "../hooks/queries/useDashboardData";

export default function DashboardPage() {
  const { metrics, recentLogs, loading, isFetching, error, refetch } =
    useDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header con saludo personalizado, fecha y estado PWA */}
      <DashboardHeader />

      {/* 2. Banner de Error si falla la conexión */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-semibold text-sm">
                Error cargando métricas en tiempo real
              </p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors flex items-center gap-1.5 shrink-0"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar
          </button>
        </div>
      )}

      {/* 3. Acciones Rápidas (1-Click Shortcuts) */}
      <DashboardQuickActions />

      {/* 4. Métricas Operativas Clave en Tiempo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} colorIndex={idx} />
        ))}
      </div>

      {/* 5. Sección de Tutoriales Interactivos Paso a Paso */}
      <TutorialSection />

      {/* 6. Registro de Actividad y Estado de la Plataforma */}
      <div className="grid grid-cols-1 gap-12">
        <DashboardActivityTable
          logs={recentLogs}
          loading={loading || isFetching}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
}
