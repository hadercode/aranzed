import { Check } from "lucide-react";
import type { Permission } from "../../hooks/queries/usePermissionsQuery";
import { usePermissionsContext } from "../../context";

interface PermissionItemCardProps {
  permission: Permission;
}

export function PermissionItemCard({ permission }: PermissionItemCardProps) {
  const { localRolePerms, handleTogglePermission } = usePermissionsContext();
  const isChecked = localRolePerms.has(permission.id);

  const getActionBadgeClass = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("read") || act.includes("get") || act.includes("list")) {
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    }
    if (act.includes("create") || act.includes("post") || act.includes("add")) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    }
    if (
      act.includes("update") ||
      act.includes("put") ||
      act.includes("edit") ||
      act.includes("patch")
    ) {
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    }
    if (act.includes("delete") || act.includes("remove")) {
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900";
    }
    return "bg-[var(--color-sage-50)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/15 dark:text-[var(--color-sage-400)] border-[var(--color-border)]";
  };

  const getPermissionDescription = (resource: string, action: string) => {
    const res = resource.toLowerCase();
    const act = action.toLowerCase();

    if (res === 'products') {
      if (act === 'read') return 'Consultar, filtrar y visualizar productos y servicios en el catálogo.';
      if (act === 'manage') return 'Crear, editar, ajustar costos, márgenes y eliminar productos.';
    }
    if (res === 'categories') {
      if (act === 'read') return 'Ver y explorar categorías del catálogo y su estructura.';
      if (act === 'manage') return 'Crear, editar y eliminar categorías y subcategorías.';
    }
    if (res === 'uofm') {
      if (act === 'read') return 'Consultar unidades de medida disponibles en el sistema.';
      if (act === 'manage') return 'Crear, actualizar y eliminar unidades de medida.';
    }
    if (res === 'users') {
      if (act === 'read') return 'Visualizar usuarios registrados en la plataforma.';
      if (act === 'manage') return 'Crear, editar cuentas de usuario y asignar roles.';
    }
    if (res === 'roles') {
      if (act === 'read') return 'Consultar roles existentes en el sistema.';
      if (act === 'manage') return 'Crear, editar roles y gestionar matriz de permisos.';
    }
    if (res === 'company') {
      if (act === 'read') return 'Ver información de la empresa y configuraciones.';
      if (act === 'manage') return 'Modificar perfil de empresa, logos y parámetros fiscales.';
    }
    if (res === 'audit') {
      if (act === 'read') return 'Consultar pistas de auditoría y registros de actividad.';
      if (act === 'manage') return 'Exportar y gestionar registros de auditoría.';
    }

    return `Permiso para ${act} en el módulo ${res}.`;
  };

  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      onClick={() => handleTogglePermission(permission.id)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleTogglePermission(permission.id);
        }
      }}
      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] ${
        isChecked
          ? "border-[var(--color-sage-500)] bg-[var(--color-sage-50)]/70 dark:bg-[var(--color-sage-500)]/10 shadow-xs"
          : "border-[var(--color-border)] hover:border-[var(--color-sage-500)]/40 hover:bg-[var(--color-surface-hover)] bg-[var(--color-surface-card)]"
      }`}
    >
      {/* Checkbox indicator */}
      <div
        className={`w-4.5 h-4.5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
          isChecked
            ? "bg-[var(--color-sage-500)] border-[var(--color-sage-500)] shadow-xs"
            : "border-gray-300 dark:border-gray-600 group-hover:border-[var(--color-sage-500)]"
        }`}
      >
        {isChecked && (
          <Check size={12} className="text-white" strokeWidth={3} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-xs text-[var(--color-text-primary)]">
            {permission.action}
          </span>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${getActionBadgeClass(
              permission.action
            )}`}
          >
            {permission.resource}
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
          {getPermissionDescription(permission.resource, permission.action)}
        </p>
      </div>
    </div>
  );
}

export default PermissionItemCard;
