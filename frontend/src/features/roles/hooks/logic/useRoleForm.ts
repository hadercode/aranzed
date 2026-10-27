import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role } from "../queries/useRolesQuery";
import { roleSchema, type RoleFormData } from "../../schemas/role.schema";

interface UseRoleFormOptions {
  editingRole: Role | null;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function useRoleForm({ editingRole, onSubmit }: UseRoleFormOptions) {
  const isEditing = Boolean(editingRole);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingRole) {
      reset({
        name: editingRole.name,
        description: editingRole.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [editingRole, reset]);

  return {
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    isEditing,
    reset,
  };
}
