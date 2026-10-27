import { forwardRef, type ReactNode, type SelectHTMLAttributes, useId } from "react";
import { ChevronDown } from "lucide-react";

export type SelectSizeVariant = "sm" | "md" | "lg";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  placeholder?: string;
  options?: SelectOption[];
  containerClassName?: string;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  variant?: "default" | string;
  sizeVariant?: SelectSizeVariant;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      placeholder,
      options,
      children,
      className = "",
      containerClassName = "",
      icon,
      leftIcon,
      variant,
      sizeVariant = "md",
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const leadingIcon = icon || leftIcon;
    const selectId = id || generatedId;

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

    const getPaddingClasses = () => {
      if (sizeVariant === "sm") {
        return `py-1.5 ${leadingIcon ? "pl-8" : "px-2.5"} pr-7 text-xs rounded-lg`;
      }
      if (sizeVariant === "lg") {
        return `py-3 ${leadingIcon ? "pl-11" : "px-4"} pr-11 text-base rounded-2xl`;
      }
      return `py-2.5 ${leadingIcon ? "pl-10" : "px-4"} pr-10 text-sm rounded-xl`;
    };

    const getChevronConfig = () => {
      if (sizeVariant === "sm") {
        return {
          position: "right-2",
          iconPos: "left-2.5",
          size: 14,
        };
      }
      if (sizeVariant === "lg") {
        return {
          position: "right-4",
          iconPos: "left-4",
          size: 20,
        };
      }
      return {
        position: "right-3.5",
        iconPos: "left-3.5",
        size: 18,
      };
    };

    const chevronConfig = getChevronConfig();

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className={`block text-sm font-medium mb-1.5 transition-colors ${getLabelColor()}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <div
              className={`absolute ${chevronConfig.iconPos} text-gray-400 pointer-events-none flex items-center`}
            >
              {leadingIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full bg-[var(--color-surface-card)] border outline-none appearance-none transition-all text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getPaddingClasses()} ${getBorderStyles()} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-400">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[var(--color-surface-card)] text-[var(--color-text-primary)]"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div
            className={`absolute ${chevronConfig.position} text-gray-400 pointer-events-none flex items-center`}
          >
            <ChevronDown size={chevronConfig.size} />
          </div>
        </div>

        {error && (
          <p
            className={`mt-1 font-medium text-red-500 animate-in fade-in duration-150 ${
              sizeVariant === "sm" ? "text-[11px]" : "text-xs"
            }`}
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            className={`mt-1 text-[var(--color-text-secondary)] ${
              sizeVariant === "sm" ? "text-[11px]" : "text-xs"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

