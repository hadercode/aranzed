import type { Role } from "../hooks/queries/useRolesQuery";
import type { RoleFormData } from "../schemas/role.schema";
import { useRoleForm } from "../hooks/logic/useRoleForm";
import {
  TextInput,
  Textarea,
  FormActions,
} from "@/shared/components/ui";

export interface RoleFormProps {
  editingRole: Role | null;
  isMutating: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function RoleForm({
  editingRole,
  isMutating,
  error,
  onCancel,
  onSubmit,
}: RoleFormProps) {
  const { register, handleSubmit, errors, isEditing } = useRoleForm({
    editingRole,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert-danger p-3 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      <TextInput
        label="Nombre del Rol"
        required
        placeholder="ej. ADMIN, MANAGER, EDITOR"
        {...register("name")}
        error={errors.name?.message}
      />

      <Textarea
        label="Descripción"
        placeholder="Describe las responsabilidades o alcance de este rol..."
        rows={3}
        {...register("description")}
        error={errors.description?.message}
      />

      <FormActions
        onCancel={onCancel}
        loading={isMutating}
        submitText={isEditing ? "Actualizar Rol" : "Crear Rol"}
        loadingText="Guardando..."
      />
    </form>
  );
}

export default RoleForm;
