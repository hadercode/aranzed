import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .max(50, "El nombre no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .max(50, "Los apellidos no pueden exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "El teléfono no puede exceder 30 caracteres")
    .optional()
    .or(z.literal("")),
  jobTitle: z
    .string()
    .max(100, "El cargo no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "La biografía no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(
        /[\d!@#$%^&*(),.?":{}|<>]/,
        "Debe contener al menos un número o carácter especial"
      ),
    confirmPassword: z
      .string()
      .min(1, "Debe confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
