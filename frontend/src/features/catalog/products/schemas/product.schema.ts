import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del producto o servicio es obligatorio')
    .max(150, 'El nombre no puede superar los 150 caracteres'),
  type: z.enum(['TRADITIONAL', 'RAW_MATERIAL', 'FINISHED_GOOD', 'SERVICE']),
  uomId: z
    .string()
    .min(1, 'La unidad de medida es obligatoria'),
  categoryId: z
    .string()
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .max(1000, 'La URL o ruta no puede superar los 1000 caracteres')
    .refine(
      (val) =>
        !val ||
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('/storage/view') ||
        val.startsWith('storage/view') ||
        val.startsWith('products/') ||
        val.startsWith('blob:') ||
        val.startsWith('data:image/'),
      {
        message: 'Debe ser una URL válida (http/https) o una ruta de almacenamiento válida',
      }
    )
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional()
    .or(z.literal('')),
  lastCost: z
    .number()
    .min(0, 'El costo no puede ser negativo'),
  profitMargin: z
    .number()
    .min(0, 'El margen de ganancia no puede ser negativo'),
  lastSalePrice: z
    .number()
    .min(0, 'El precio de venta no puede ser negativo'),
  isActive: z.boolean(),
  manageInventory: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductFormSchema = ProductFormData;
