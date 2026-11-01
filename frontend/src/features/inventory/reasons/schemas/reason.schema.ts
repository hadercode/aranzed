import { z } from 'zod';

export const reasonSchema = z.object({
  name: z.string().min(1, 'El nombre del motivo es requerido'),
  type: z.enum(['INPUT', 'OUTPUT', 'BOTH']),
  description: z.string().optional(),
});

export type ReasonFormData = z.infer<typeof reasonSchema>;
