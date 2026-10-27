import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { Check, AlertCircle } from "lucide-react";

export type InputSizeVariant = "sm" | "md" | "lg";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  sizeVariant?: InputSizeVariant;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      id,
      disabled,
      required,
      sizeVariant = "md",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

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

    const hasRightElement = Boolean(rightIcon || error || success);

    const getPaddingClasses = () => {
      if (sizeVariant === "sm") {
        return `px-2.5 py-1.5 text-xs rounded-lg ${leftIcon ? "pl-8" : ""} ${
          hasRightElement ? "pr-8" : ""
        }`;
      }
      if (sizeVariant === "lg") {
        return `px-4 py-3 text-base rounded-2xl ${leftIcon ? "pl-11" : ""} ${
          hasRightElement ? "pr-11" : ""
        }`;
      }
      return `px-4 py-2.5 text-sm rounded-xl ${leftIcon ? "pl-10" : ""} ${
        hasRightElement ? "pr-10" : ""
      }`;
    };

    const getIconConfig = () => {
      if (sizeVariant === "sm") {
        return {
          leftPos: "left-2.5",
          rightPos: "right-2.5",
          size: 14,
        };
      }
      if (sizeVariant === "lg") {
        return {
          leftPos: "left-4",
          rightPos: "right-4",
          size: 20,
        };
      }
      return {
        leftPos: "left-3.5",
        rightPos: "right-3.5",
        size: 18,
      };
    };

    const iconConfig = getIconConfig();

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-1.5 transition-colors ${getLabelColor()}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className={`absolute ${iconConfig.leftPos} text-gray-400 pointer-events-none flex items-center`}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[var(--color-surface-bg)]/40 border outline-none transition-all text-[var(--color-text-primary)] placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${getPaddingClasses()} ${getBorderStyles()} ${className}`}
            {...props}
          />

          {rightIcon ? (
            <div
              className={`absolute ${iconConfig.rightPos} text-gray-400 flex items-center`}
            >
              {rightIcon}
            </div>
          ) : error ? (
            <div
              className={`absolute ${iconConfig.rightPos} text-red-500 pointer-events-none flex items-center animate-in fade-in zoom-in-75 duration-150`}
            >
              <AlertCircle size={iconConfig.size} />
            </div>
          ) : success ? (
            <div
              className={`absolute ${iconConfig.rightPos} text-emerald-500 pointer-events-none flex items-center animate-in fade-in zoom-in-75 duration-150`}
            >
              <Check size={iconConfig.size} />
            </div>
          ) : null}
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

TextInput.displayName = "TextInput";

export default TextInput;

