import { Save, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { usePermissionsContext } from "../../context";

export function PermissionsHeader() {
  const {
    selectedRole,
    hasChanges,
    isSaving,
    stats,
    handleSave,
    handleResetChanges,
  } = usePermissionsContext();

  if (!selectedRole) return null;

  return (
    <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-[var(--color-sage-50)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/10 dark:text-[var(--color-sage-400)]">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Permisos de: {selectedRole.name}
          </h2>
          {hasChanges ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              <AlertTriangle size={12} />
              Cambios sin guardar
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
              Sincronizado
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1.5">
          {selectedRole.description || "Rol sin descripción adicional"} •{" "}
          <strong className="text-[var(--color-text-primary)] font-semibold">
            {stats.activeInRole} de {stats.totalPermissions}
          </strong>{" "}
          permisos asignados
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetChanges}
            disabled={isSaving}
            leftIcon={<RotateCcw size={15} />}
          >
            Descartar
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
          loading={isSaving}
          loadingText="Guardando..."
          disabled={!hasChanges}
          leftIcon={<Save size={16} />}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

export default PermissionsHeader;
