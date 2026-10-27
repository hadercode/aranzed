import type { ReactNode } from "react";

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  icon?: ReactNode;
  action?: PageHeaderAction;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  children,
  className = "mb-8",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
    >
      <div>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-cyan-500/15 text-[#F43F5E] dark:text-[#FB7185] border border-pink-500/20 shrink-0 shadow-xs">
              {icon}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm md:text-base">
            {description}
          </p>
        )}
      </div>

      {(action || children) && (
        <div className="flex items-center gap-3 shrink-0">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 bg-gradient-to-r from-[#22B2B8] to-[#F43F5E] hover:from-[#1A969C] hover:to-[#E11D48] text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(244,63,94,0.3)] cursor-pointer disabled:opacity-50 active:scale-[0.98] ${
                action.className || ""
              }`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
