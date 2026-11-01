import { CheckCircle2 } from 'lucide-react';

interface PasswordRequirementsListProps {
  isMinLength: boolean;
  hasUppercase: boolean;
  hasNumberOrSpecial: boolean;
  passwordsMatch: boolean;
}

export function PasswordRequirementsList({
  isMinLength,
  hasUppercase,
  hasNumberOrSpecial,
  passwordsMatch,
}: PasswordRequirementsListProps) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-2 text-xs">
      <p className="font-semibold text-[var(--color-text-primary)]">
        Requisitos de seguridad mínimos:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          className={`flex items-center gap-2 ${
            isMinLength
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${isMinLength ? 'text-emerald-500' : 'text-gray-400'}`}
          />
          <span>Mínimo 8 caracteres</span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            hasUppercase
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-gray-400'}`}
          />
          <span>Al menos una letra mayúscula</span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            hasNumberOrSpecial
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${hasNumberOrSpecial ? 'text-emerald-500' : 'text-gray-400'}`}
          />
          <span>Un número o carácter especial</span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            passwordsMatch
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-500' : 'text-gray-400'}`}
          />
          <span>Las contraseñas coinciden</span>
        </div>
      </div>
    </div>
  );
}

