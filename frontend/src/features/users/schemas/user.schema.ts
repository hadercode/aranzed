import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  roles: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un rol"),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo electrónico inválido"),
  password: z
    .string()
    .refine((val) => !val || val.length >= 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .optional(),
  roles: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un rol"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UserFormData = {
  email: string;
  password?: string;
  roles: string[];
};

export const getUserFormSchema = (isEditing: boolean) =>
  isEditing ? updateUserSchema : createUserSchema;
