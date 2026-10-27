import type { ReactNode } from "react";

export interface FormGroupProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export function FormGroup({
  label,
  required,
  error,
  helperText,
  children,
  className = "",
}: FormGroupProps) {
  const getLabelColor = () => {
    if (error) {
      return "text-red-500 dark:text-red-400";
    }
    return "text-[var(--color-text-primary)]";
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 transition-colors ${getLabelColor()}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

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

export default FormGroup;
