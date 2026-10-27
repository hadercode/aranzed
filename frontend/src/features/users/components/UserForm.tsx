import type { User } from "../types/user";
import type { UserFormData } from "../schemas/user.schema";
import { useUserForm } from "../hooks/logic/useUserForm";
import {
  TextInput,
  Checkbox,
  FormGroup,
  FormActions,
} from "@/shared/components/ui";

export interface UserFormProps {
  editingUser: User | null;
  availableRoles: string[];
  formLoading: boolean;
  formError: string;
  onCancel: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserForm({
  editingUser,
  availableRoles,
  formLoading,
  formError,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isEditing,
    selectedRoles,
    handleToggleRole,
  } = useUserForm({ editingUser, onSubmit });

  return (
    <div>
      {formError && (
        <div className="alert-danger mb-4 p-3 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@nexus.com"
          required
          {...register("email")}
          error={errors.email?.message}
        />

        <TextInput
          label={isEditing ? "Contraseña (Opcional)" : "Contraseña"}
          type="password"
          placeholder={
            isEditing
              ? "Dejar en blanco para no cambiar"
              : "Mínimo 6 caracteres"
          }
          required={!isEditing}
          {...register("password")}
          error={errors.password?.message}
        />

        <FormGroup
          label="Roles"
          required
          error={errors.roles?.message}
        >
          <div className="space-y-2">
            {availableRoles.map((role) => (
              <Checkbox
                key={role}
                card
                label={role}
                checked={selectedRoles.includes(role)}
                onChange={() => handleToggleRole(role)}
                error={errors.roles?.message ? "" : undefined}
              />
            ))}
          </div>
        </FormGroup>

        <FormActions
          onCancel={onCancel}
          loading={formLoading}
          submitText="Guardar"
          loadingText="Guardando..."
        />
      </form>
    </div>
  );
}
