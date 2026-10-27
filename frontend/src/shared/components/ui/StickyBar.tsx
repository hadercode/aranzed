import type { ReactNode } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from './Button';

export interface StickyBarIndicator {
  label?: string;
  value: ReactNode;
  icon?: ReactNode;
  highlight?: boolean;
}

export interface StickyBarProps {
  // 1. Contenido contextual izquierdo
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  indicators?: StickyBarIndicator[];
  leftContent?: ReactNode;

  // 2. Acciones del formulario (derecha)
  showCancelButton?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  cancelDisabled?: boolean;

  showSubmitButton?: boolean;
  submitText?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  submitIcon?: ReactNode;
  submitFormId?: string; // Atributo HTML form="id" si el botón está fuera del <form>

  // 3. Acciones totalmente personalizadas
  actions?: ReactNode;
  rightContent?: ReactNode;

  // 4. Estilos y contenedor
  maxWidth?: string; // default: 'max-w-7xl'
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
}

export function StickyBar({
  title,
  subtitle,
  badge,
  indicators,
  leftContent,

  showCancelButton = true,
  cancelText = 'Cancelar',
  onCancel,
  cancelDisabled = false,

  showSubmitButton = true,
  submitText = 'Guardar',
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  submitIcon = <Save className="w-4 h-4" />,
  submitFormId,

  actions,
  rightContent,

  maxWidth = 'max-w-7xl',
  className = '',
  containerClassName = '',
  children,
}: StickyBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-surface-card)]/90 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg py-3 px-4 sm:px-6 md:px-8 transition-colors ${containerClassName}`}
    >
      <div
        className={`${maxWidth} mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 ${className}`}
      >
        {/* Contenido Izquierdo */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          {/* Título y Subtítulo / Badge */}
          {(title || subtitle || badge) && (
            <div className="hidden sm:block">
              {subtitle && (
                <p className="text-xs text-[var(--color-text-muted)] leading-tight">
                  {subtitle}
                </p>
              )}
              <div className="flex items-center gap-2">
                {title && (
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate max-w-xs">
                    {title}
                  </p>
                )}
                {badge}
              </div>
            </div>
          )}

          {/* Indicadores / Métricas en línea */}
          {indicators && indicators.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              {indicators.map((ind, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-[var(--color-text-secondary)] ${
                    i > 0 || title || subtitle
                      ? 'border-l border-[var(--color-border)] pl-3 sm:pl-4'
                      : ''
                  }`}
                >
                  {ind.icon}
                  {ind.label && <span>{ind.label}</span>}
                  <span
                    className={`font-semibold ${
                      ind.highlight
                        ? 'text-emerald-600 dark:text-emerald-400 font-mono text-sm'
                        : 'text-[var(--color-text-primary)]'
                    }`}
                  >
                    {ind.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Slot libre a la izquierda */}
          {leftContent}
        </div>

        {/* Contenido / Acciones a la derecha */}
        {actions || rightContent ? (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {actions || rightContent}
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {showCancelButton && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={cancelDisabled || isSubmitting}
                leftIcon={<X className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                {cancelText}
              </Button>
            )}

            {showSubmitButton && (
              <Button
                type={onSubmit ? 'button' : 'submit'}
                onClick={onSubmit}
                form={submitFormId}
                variant="primary"
                loading={isSubmitting}
                disabled={submitDisabled || isSubmitting}
                leftIcon={submitIcon}
                className="flex-1 sm:flex-initial"
              >
                {submitText}
              </Button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default StickyBar;
