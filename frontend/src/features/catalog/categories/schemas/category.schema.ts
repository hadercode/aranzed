import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la categoría es obligatorio')
    .max(50, 'El nombre no puede superar 50 caracteres'),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
