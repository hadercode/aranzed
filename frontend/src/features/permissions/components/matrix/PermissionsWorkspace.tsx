import { usePermissionsContext } from "../../context";
import { PermissionsHeader } from "./PermissionsHeader";
import { PermissionSearch } from "./PermissionSearch";
import { PermissionModuleCard } from "./PermissionModuleCard";
import { PermissionsEmptyState } from "./PermissionsEmptyState";

export function PermissionsWorkspace() {
  const {
    selectedRole,
    groupedPermissions,
    setSearchQuery,
  } = usePermissionsContext();

  const groupedEntries = Object.entries(groupedPermissions);

  return (
    <div className="flex-1 bg-[var(--color-surface-card)] rounded-2xl shadow-[var(--shadow-organic)] border border-[var(--color-border)] flex flex-col overflow-hidden min-h-[500px]">
      {!selectedRole ? (
        <PermissionsEmptyState type="no-role" />
      ) : (
        <>
          {/* Active Role Permissions Header */}
          <PermissionsHeader />

          {/* Search Bar & Bulk Actions */}
          <PermissionSearch />

          {/* Modules & Permissions Scrollable List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[var(--color-surface-bg)]/40 max-h-[calc(100vh-320px)]">
            {groupedEntries.length === 0 ? (
              <PermissionsEmptyState
                type="no-results"
                onClearSearch={() => setSearchQuery("")}
              />
            ) : (
              groupedEntries.map(([resource, perms]) => (
                <PermissionModuleCard
                  key={resource}
                  resource={resource}
                  permissions={perms}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PermissionsWorkspace;
