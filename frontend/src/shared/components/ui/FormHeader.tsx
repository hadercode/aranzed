import type { ReactNode } from 'react';
import { ArrowLeft, ChevronRight, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, type ButtonVariant } from './Button';

export interface FormHeaderBreadcrumb {
  label: string;
  to?: string;
}

export interface FormHeaderProps {
  // 1. Navegación superior (Botón Atrás o Breadcrumbs)
  backText?: string;
  backTo?: string;
  onBack?: () => void;
  breadcrumbs?: FormHeaderBreadcrumb[];

  // 2. Título, Icono e Identidad
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;

  // 3. Botón Cancelar
  showCancelButton?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  cancelDisabled?: boolean;
  cancelVariant?: ButtonVariant;
  cancelIcon?: ReactNode;

  // 4. Botón Guardar / Submit
  showSubmitButton?: boolean;
  submitText?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  submitIcon?: ReactNode;
  submitFormId?: string; // Atributo form="id" de HTML si el botón está fuera del <form>

  // 5. Personalización y extensiones
  actions?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Componente global de cabecera para formularios de creación y edición (Full-Page Forms).
 * Unifica navegación de retorno / breadcrumbs, badges de iconos, títulos descriptivos
 * y botones de acción sincronizados con el estado de guardado/mutación.
 */
export function FormHeader({
  // Navegación
  backText,
  backTo,
  onBack,
  breadcrumbs,

  // Identidad
  title,
  subtitle,
  description,
  icon,

  // Cancelar
  showCancelButton = true,
  cancelText = 'Cancelar',
  onCancel,
  cancelDisabled = false,
  cancelVariant = 'secondary',
  cancelIcon = <X className="w-4 h-4" />,

  // Guardar
  showSubmitButton = true,
  submitText = 'Guardar',
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  submitIcon = <Save className="w-4 h-4" />,
  submitFormId,

  // Slots
  actions,
  rightContent,
  className = '',
  children,
}: FormHeaderProps) {
  const resolvedDescription = description ?? subtitle;
  const handleBackClick = onBack ?? onCancel;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border)] ${className}`}
    >
      <div className="space-y-1">
        {/* Navegación: Breadcrumbs o Botón de Retorno */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mb-1 flex-wrap">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isLast
                          ? 'text-[var(--color-text-primary)] font-medium'
                          : undefined
                      }
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  )}
                </div>
              );
            })}
          </div>
        ) : backText ? (
          backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{backText}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{backText}</span>
            </button>
          )
        ) : null}

        {/* Título e Icono */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-cyan-500/15 text-[#F43F5E] dark:text-[#FB7185] border border-pink-500/25 flex items-center justify-center shrink-0 shadow-2xs">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {title}
            </h1>
            {resolvedDescription && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                {resolvedDescription}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>

      {/* Botones de Acción (Derecha) */}
      <div className="flex items-center gap-2.5 sm:self-center">
        {actions || rightContent ? (
          actions || rightContent
        ) : (
          <>
            {showCancelButton && (
              <Button
                type="button"
                variant={cancelVariant}
                onClick={handleBackClick}
                disabled={cancelDisabled || isSubmitting}
                leftIcon={cancelIcon}
              >
                {cancelText}
              </Button>
            )}

            {showSubmitButton && (
              <Button
                type="submit"
                form={submitFormId}
                variant="primary"
                loading={isSubmitting}
                disabled={submitDisabled || isSubmitting}
                leftIcon={submitIcon}
                onClick={onSubmit}
              >
                {submitText}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FormHeader;
