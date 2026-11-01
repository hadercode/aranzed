import { z } from 'zod';

export const unitOfMeasureSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'El código de la unidad es requerido')
    .max(10, 'Máximo 10 caracteres'),
  name: z
    .string()
    .trim()
    .min(1, 'El nombre descriptivo es requerido')
    .max(50, 'Máximo 50 caracteres'),
  isActive: z.boolean().default(true),
  allowDecimals: z.boolean().default(true),
});

export type UnitOfMeasureSchemaValues = z.infer<typeof unitOfMeasureSchema>;
