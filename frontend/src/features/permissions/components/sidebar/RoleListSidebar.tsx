import { Shield } from "lucide-react";
import { usePermissionsContext } from "../../context";
import { RoleSidebarItem } from "./RoleSidebarItem";

export function RoleListSidebar() {
  const { roles } = usePermissionsContext();

  return (
    <div className="w-full lg:w-80 shrink-0 bg-[var(--color-surface-card)] rounded-2xl shadow-[var(--shadow-organic)] border border-[var(--color-border)] flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-bg)] flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2 text-sm">
          <Shield size={18} className="text-[var(--color-sage-500)]" />
          Roles Disponibles
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
          {roles.length} roles
        </span>
      </div>

      {/* Roles List */}
      <div className="overflow-y-auto flex-1 p-2 space-y-1.5 max-h-[calc(100vh-280px)]">
        {roles.length === 0 ? (
          <div className="p-6 text-center text-sm text-[var(--color-text-secondary)]">
            No hay roles configurados.
          </div>
        ) : (
          roles.map((role) => (
            <RoleSidebarItem key={role.id} role={role} />
          ))
        )}
      </div>
    </div>
  );
}

export default RoleListSidebar;
