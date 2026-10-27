import { forwardRef, type TextareaHTMLAttributes, useId } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      className = "",
      containerClassName = "",
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    const getBorderStyles = () => {
      if (error) {
        return "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500";
      }
      if (success) {
        return "border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";
      }
      return "border-[var(--color-border)] focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)]";
    };

    const getLabelColor = () => {
      if (error) {
        return "text-red-500 dark:text-red-400";
      }
      return "text-[var(--color-text-primary)]";
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className={`block text-sm font-medium mb-1.5 transition-colors ${getLabelColor()}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-[var(--color-surface-bg)]/40 border rounded-xl outline-none transition-all text-sm text-[var(--color-text-primary)] placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${getBorderStyles()} ${className}`}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
