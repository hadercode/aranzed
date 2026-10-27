import { z } from 'zod';

export const recipeItemSchema = z.object({
  id: z.string().optional(),
  productId: z
    .string()
    .min(1, 'Debe seleccionar un insumo o servicio componente'),
  quantity: z
    .number()
    .positive('La cantidad requerida debe ser mayor a 0'),
  unitCost: z
    .number()
    .min(0, 'El costo unitario no puede ser negativo'),
  notes: z
    .string()
    .max(255, 'Las notas no pueden superar 255 caracteres')
    .optional(),
  sortOrder: z.number(),
});

export const recipeSchema = z
  .object({
    code: z
      .string()
      .max(30, 'El código no puede superar 30 caracteres')
      .optional(),
    name: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(150, 'El nombre no puede superar 150 caracteres'),
    productId: z
      .string()
      .min(1, 'Debe seleccionar el producto terminado o fabricado'),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
    yieldQuantity: z
      .number()
      .positive('El rendimiento base debe ser mayor a 0'),
    description: z
      .string()
      .max(500, 'La descripción no puede superar 500 caracteres')
      .optional(),
    syncProductCost: z.boolean(),
    items: z
      .array(recipeItemSchema)
      .min(1, 'La receta debe contener al menos un insumo o mano de obra'),
  })
  .refine(
    (data) => {
      // Check that none of the component items is the parent product itself
      return !data.items.some((item) => item.productId === data.productId);
    },
    {
      message: 'Un producto no puede ser componente de su propia receta',
      path: ['items'],
    }
  );

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type RecipeItemFormData = z.infer<typeof recipeItemSchema>;
