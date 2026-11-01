import { ShieldCheck, Sparkles } from 'lucide-react';
import type { UserProfile } from '../hooks/queries/useProfileQuery';

interface PersonalTipsSidebarProps {
  profile: UserProfile | null;
}

export function PersonalTipsSidebar({ profile }: PersonalTipsSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-sage-500)]" />
          <span>Visibilidad de la Cuenta</span>
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Tus datos personales y foto de perfil son visibles para otros
          miembros del equipo en la plataforma Nexus.
        </p>
        <div className="p-3.5 rounded-xl bg-[var(--color-sage-50)] text-xs text-[var(--color-sage-600)] border border-[var(--color-sage-500)]/20">
          <p className="font-semibold mb-1">Roles Asignados:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
            {(profile?.roles || []).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Consejo de Perfil</span>
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Mantener tu número de teléfono y cargo actualizados permite a tus
          compañeros comunicarse de manera más efectiva para autorizaciones y
          operaciones en el sistema.
        </p>
      </div>
    </div>
  );
}

