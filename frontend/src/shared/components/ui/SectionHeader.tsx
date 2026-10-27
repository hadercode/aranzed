import type { ReactNode } from 'react';
import { Button, type ButtonVariant, type ButtonSize } from './Button';

export interface SectionHeaderAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  iconColorClassName?: string;
  action?: SectionHeaderAction;
  actions?: ReactNode;
  hasBorder?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Componente modular para las cabeceras de secciones y tarjetas de formulario / detalles.
 * Unifica el layout de icono temático, título, descripción y botones de acción rápida.
 */
export function SectionHeader({
  title,
  description,
  subtitle,
  icon,
  iconColorClassName = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  action,
  actions,
  hasBorder = true,
  className = '',
  children,
}: SectionHeaderProps) {
  const resolvedDescription = description ?? subtitle;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        hasBorder ? 'pb-3 border-b border-[var(--color-border)]' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColorClassName}`}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>
          {resolvedDescription && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {resolvedDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <Button
            type="button"
            variant={action.variant ?? 'outline'}
            size={action.size ?? 'sm'}
            onClick={action.onClick}
            disabled={action.disabled}
            leftIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
        {actions}
        {children}
      </div>
    </div>
  );
}

export default SectionHeader;
