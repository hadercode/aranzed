import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del rol es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  description: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .optional()
    .or(z.literal("")),
});

export type RoleFormData = z.infer<typeof roleSchema>;
