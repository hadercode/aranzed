import { ChevronDownIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

interface NavGroupProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  collapsed: boolean;
}

export const NavGroup = ({
  title,
  icon,
  children,
  collapsed,
}: NavGroupProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
        title={collapsed ? title : undefined}
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0">{icon}</span>
          {!collapsed && <span className="font-medium">{title}</span>}
        </div>
        {!collapsed && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded && !collapsed ? "max-h-48" : "max-h-0"
        }`}
      >
        <div className="mt-1 space-y-1">{children}</div>
      </div>
    </div>
  );
};
