import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/shared/components/ui";
import { PermissionsProvider, usePermissionsContext } from "../context";
import {
  RoleListSidebar,
  PermissionsWorkspace,
  PermissionsErrorBanner,
  PermissionsDialogs,
} from "../components";

function RolePermissionsContent() {
  const { loading } = usePermissionsContext();

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto">
        <PageHeader
          title="Matriz de Permisos"
          description="Asignación avanzada de permisos y privilegios por rol y módulo"
        />
        <div className="p-16 text-center bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-sage-500)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">
            Cargando roles y permisos del sistema...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto flex flex-col space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Matriz de Permisos"
        description="Asignación avanzada de permisos y privilegios por rol y módulo"
      />

      {/* Error Alert Banner */}
      <PermissionsErrorBanner />

      {/* Main Workspace Layout (Sidebar + Matrix) */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[640px]">
        <RoleListSidebar />
        <PermissionsWorkspace />
      </div>

      {/* Confirmation and Success Dialogs */}
      <PermissionsDialogs />
    </div>
  );
}

export function RolePermissionsPage() {
  return (
    <PermissionsProvider>
      <RolePermissionsContent />
    </PermissionsProvider>
  );
}

export default RolePermissionsPage;
