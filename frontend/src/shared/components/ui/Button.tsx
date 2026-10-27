import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "fuchsia"
  | "cyan"
  | "rainbow"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all shadow-xs cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-gradient-to-r from-[#22B2B8] to-[#F43F5E] hover:from-[#1A969C] hover:to-[#E11D48] text-white focus:ring-[#F43F5E] shadow-sm hover:shadow-[0_4px_18px_rgba(244,63,94,0.32)]",
      fuchsia:
        "bg-[#F43F5E] hover:bg-[#E11D48] text-white focus:ring-[#F43F5E] shadow-sm hover:shadow-[0_4px_16px_rgba(244,63,94,0.35)]",
      cyan:
        "bg-[#22B2B8] hover:bg-[#1A969C] text-white focus:ring-[#22B2B8] shadow-sm hover:shadow-[0_4px_16px_rgba(34,178,184,0.35)]",
      rainbow:
        "bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] hover:opacity-95 text-white focus:ring-[#8B5CF6] shadow-sm hover:shadow-[0_4px_18px_rgba(139,92,246,0.4)]",
      secondary:
        "bg-[var(--color-surface-bg)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-[var(--color-border)]",
      outline:
        "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] focus:ring-[var(--color-border)]",
      danger:
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600",
      ghost:
        "bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:ring-transparent shadow-none",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-5 py-3 text-base gap-2.5",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
