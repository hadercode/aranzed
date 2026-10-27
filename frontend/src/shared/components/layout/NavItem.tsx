import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItemProps {
  to: string;
  children: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  collapsed?: boolean;
  isSub?: boolean;
}

export const NavItem = ({
  to,
  children,
  icon,
  active = false,
  collapsed = false,
  isSub = false,
}: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
        isSub ? "pl-11 pr-4" : "px-4"
      } ${
        active
          ? "bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-transparent text-[#F43F5E] dark:text-[#FB7185] font-semibold shadow-xs border-l-3 border-[#F43F5E]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
      } ${collapsed && isSub ? "hidden" : ""}`}
      title={collapsed && typeof children === "string" ? children : undefined}
    >
      {icon && (
        <span
          className={`shrink-0 ${active ? "text-[#F43F5E] dark:text-[#FB7185]" : ""}`}
        >
          {icon}
        </span>
      )}
      {!collapsed && <span className="whitespace-nowrap">{children}</span>}
    </Link>
  );
};
