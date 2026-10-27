import type { Permission } from "../../hooks/queries/usePermissionsQuery";
import { PermissionItemCard } from "./PermissionItemCard";
import { PermissionModuleHeader } from "./PermissionModuleHeader";
import { usePermissionsContext } from "../../context";

interface PermissionModuleCardProps {
  resource: string;
  permissions: Permission[];
}

export function PermissionModuleCard({
  resource,
  permissions,
}: PermissionModuleCardProps) {
  const { localRolePerms, handleToggleModule } = usePermissionsContext();

  const activeCount = permissions.filter((p) => localRolePerms.has(p.id)).length;
  const allSelected = permissions.length > 0 && activeCount === permissions.length;
  const someSelected = activeCount > 0 && !allSelected;

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xs transition-shadow hover:shadow-sm">
      {/* Module Header Subcomponent */}
      <PermissionModuleHeader
        resource={resource}
        activeCount={activeCount}
        totalCount={permissions.length}
        allSelected={allSelected}
        someSelected={someSelected}
        onToggle={() => handleToggleModule(resource, permissions)}
      />

      {/* Permissions Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-[var(--color-surface-card)]">
        {permissions.map((p) => (
          <PermissionItemCard key={p.id} permission={p} />
        ))}
      </div>
    </div>
  );
}

export default PermissionModuleCard;
