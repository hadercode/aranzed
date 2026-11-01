import { z } from 'zod';

export const warehouseSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre del almacén es requerido'),
  location: z.string().optional(),
  isActive: z.boolean(),
  isSalesWarehouse: z.boolean(),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
