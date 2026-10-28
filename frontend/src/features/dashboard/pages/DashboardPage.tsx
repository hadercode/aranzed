import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  DashboardHeader,
  DashboardQuickActions,
  MetricCard,
  TutorialSection,
  DashboardActivityTable,
  TeamUpdateItem,
} from '../components';
import { useDashboardData } from '../hooks/queries/useDashboardData';

export default function DashboardPage() {
  const { metrics, recentLogs, teamUpdates, loading, isFetching, error, refetch } =
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
              <p className="font-semibold text-sm">Error cargando métricas en tiempo real</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardActivityTable
          logs={recentLogs}
          loading={loading || isFetching}
          onRefresh={refetch}
        />

        <div className="space-y-6">
          <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
            <h2 className="font-bold text-base text-[var(--color-text-primary)] mb-3">
              Estado de la Plataforma
            </h2>
            <div className="h-32 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl flex flex-col items-center justify-center border border-pink-500/20 p-4 text-center">
              <span className="font-extrabold text-base bg-gradient-to-r from-[#22B2B8] to-[#F43F5E] bg-clip-text text-transparent">
                100% Operativo
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1">
                Base de datos PostgreSQL, almacenes y PWA sincronizados
              </span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                Novedades del Taller
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                En vivo
              </span>
            </div>
            <div className="space-y-2">
              {teamUpdates.map((update, idx) => (
                <TeamUpdateItem key={idx} {...update} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
