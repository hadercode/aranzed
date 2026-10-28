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
  const { metrics, recentLogs, teamUpdates } = useDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header con saludo personalizado, fecha y estado PWA */}
      <DashboardHeader />

      {/* 2. Acciones Rápidas (1-Click Shortcuts) */}
      <DashboardQuickActions />

      {/* 3. Métricas Operativas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} colorIndex={idx} />
        ))}
      </div>

      {/* 4. Sección de Tutoriales Interactivos Paso a Paso */}
      <TutorialSection />

      {/* 5. Registro de Actividad y Estado de la Plataforma */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardActivityTable logs={recentLogs} />

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
                Base de datos, almacenes y PWA sincronizados
              </span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
            <h2 className="font-bold text-base text-[var(--color-text-primary)] mb-4">
              Novedades del Taller
            </h2>
            <div className="space-y-3.5">
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
