import { ShieldAlert } from 'lucide-react';

export function SecurityAdvisorySidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Políticas de Seguridad</span>
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Por motivos de seguridad institucional, nunca compartas tus claves de acceso con terceros ni uses contraseñas previamente utilizadas en otros servicios.
        </p>
        <div className="alert-warning p-3.5 rounded-xl text-xs text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800/50">
          <p className="font-bold mb-1 text-amber-950 dark:text-amber-200">
            Cierre de Sesión:
          </p>
          <p className="text-amber-950 dark:text-amber-300 font-medium leading-relaxed">
            Al cambiar tu contraseña, tu sesión actual se mantendrá activa. En tus próximos inicios de sesión deberás ingresar tu nueva contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}

