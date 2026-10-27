import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../../types/user";
import { getUserFormSchema, type UserFormData } from "../../schemas/user.schema";

interface UseUserFormOptions {
  editingUser: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function useUserForm({ editingUser, onSubmit }: UseUserFormOptions) {
  const isEditing = Boolean(editingUser);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(getUserFormSchema(isEditing)),
    defaultValues: {
      email: "",
      password: "",
      roles: ["USER_ROLE"],
    },
  });

  const selectedRoles = watch("roles") || [];

  useEffect(() => {
    if (editingUser) {
      reset({
        email: editingUser.email,
        password: "",
        roles: editingUser.roles || [],
      });
    } else {
      reset({
        email: "",
        password: "",
        roles: ["USER_ROLE"],
      });
    }
  }, [editingUser, reset]);

  const handleToggleRole = (role: string) => {
    const currentRoles = selectedRoles;
    const nextRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    setValue("roles", nextRoles, { shouldValidate: true });
  };

  return {
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    isEditing,
    selectedRoles,
    handleToggleRole,
    reset,
  };
}
