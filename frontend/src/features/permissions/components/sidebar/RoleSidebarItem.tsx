import { Sparkles } from "lucide-react";
import type { Role } from "@/features/roles/hooks/queries/useRolesQuery";
import { usePermissionsContext } from "../../context";

interface RoleSidebarItemProps {
  role: Role;
}

export function RoleSidebarItem({ role }: RoleSidebarItemProps) {
  const { selectedRoleId, requestSelectRole, hasChanges, stats } =
    usePermissionsContext();

  const isSelected = selectedRoleId === role.id;
  const permsCount = isSelected
    ? stats.activeInRole
    : role.permissions?.length || 0;

  return (
    <button
      type="button"
      onClick={() => requestSelectRole(role)}
      className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer relative group ${
        isSelected
          ? "bg-[var(--color-sage-500)] text-white shadow-sm ring-1 ring-[var(--color-sage-600)]"
          : "hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent hover:border-[var(--color-border)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-sm truncate flex items-center gap-2">
          <span
            className={
              isSelected ? "text-white" : "text-[var(--color-text-primary)]"
            }
          >
            {role.name}
          </span>
          {isSelected && hasChanges && (
            <span
              title="Hay cambios sin guardar en este rol"
              className="inline-flex items-center px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-amber-950 font-bold animate-pulse"
            >
              * Modificado
            </span>
          )}
        </div>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
            isSelected
              ? "bg-white/20 text-white"
              : "bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
          }`}
        >
          {permsCount} perms
        </span>
      </div>

      <p
        className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
          isSelected ? "text-white/80" : "text-[var(--color-text-muted)]"
        }`}
      >
        {role.description || "Sin descripción asignada"}
      </p>

      {isSelected && (
        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
          <Sparkles size={13} className="shrink-0" />
          <span>Rol actualmente activo para edición</span>
        </div>
      )}
    </button>
  );
}

export default RoleSidebarItem;
