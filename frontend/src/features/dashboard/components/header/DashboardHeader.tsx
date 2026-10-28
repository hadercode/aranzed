import { useAuthStore } from '@/shared/hooks/store/useAuthStore';
import { Calendar, Wifi } from 'lucide-react';

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  const getGreetingName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email?.split('@')[0] || 'Administrador';
  };

  const getFormattedDate = () => {
    const today = new Date();
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(today);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] bg-clip-text text-transparent">
            Aranzed Detalles Maracaibo
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22B2B8] animate-pulse" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          ¡Hola de nuevo, {getGreetingName()}! <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Aquí tienes el resumen operativo de tu tienda y las guías para tus procesos diarios.
        </p>
      </div>

      {/* Date & System Status Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#22B2B8] shrink-0" />
          <span className="capitalize">{getFormattedDate()}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs">
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span>PWA Conectada</span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
