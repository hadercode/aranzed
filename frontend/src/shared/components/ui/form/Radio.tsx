import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: string;
  error?: string;
  success?: boolean;
  card?: boolean;
  containerClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      error,
      success,
      card = false,
      className = "",
      containerClassName = "",
      id,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    const getRadioStyles = () => {
      if (error) {
        return "border-red-500 text-red-500 focus:ring-red-500";
      }
      if (success) {
        return "border-emerald-500 text-emerald-500 focus:ring-emerald-500";
      }
      return "border-gray-300 dark:border-gray-600 text-[var(--color-sage-500)] focus:ring-[var(--color-sage-500)]";
    };

    const getCardBorderStyles = () => {
      if (error) {
        return "border-red-500 bg-red-50/10";
      }
      if (success) {
        return "border-emerald-500 bg-emerald-50/10";
      }
      if (checked) {
        return "border-[var(--color-sage-500)] bg-[var(--color-sage-50)]/20 dark:bg-[var(--color-sage-500)]/10";
      }
      return "border-[var(--color-border)] hover:bg-[var(--color-surface-bg)]";
    };

    return (
      <div className={containerClassName}>
        <label
          htmlFor={radioId}
          className={`flex items-start gap-3 cursor-pointer select-none transition-all ${
            card
              ? `p-3.5 border rounded-xl ${getCardBorderStyles()}`
              : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={ref}
            id={radioId}
            type="radio"
            disabled={disabled}
            checked={checked}
            className={`w-5 h-5 mt-0.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${getRadioStyles()} ${className}`}
            {...props}
          />

          {(label || description) && (
            <div className="flex-1 text-sm">
              {label && (
                <span
                  className={`font-medium block transition-colors ${
                    error
                      ? "text-red-500 dark:text-red-400"
                      : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {label}
                </span>
              )}
              {description && (
                <span className="text-[var(--color-text-secondary)] text-xs block mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
