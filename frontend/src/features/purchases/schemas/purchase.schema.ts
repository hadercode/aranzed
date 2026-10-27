import { z } from 'zod';

export const purchaseItemSchema = z.object({
  id: z.string().optional(),
  materialId: z.string().min(1, 'El material es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria').max(255),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unitCost: z.number().min(0, 'El costo unitario no puede ser negativo'),
  unitCostLocal: z.number().optional(),
  subtotal: z.number().min(0, 'El subtotal no puede ser negativo').optional(),
  lastEditedField: z.enum(['unitCost', 'subtotal']).optional(),
  currencySymbolFunctional: z.string().optional(),
  currencySymbolLocal: z.string().optional(),
  isTaxable: z.boolean(),
  taxRate: z.number().min(0, 'La tasa de IVA no puede ser negativa'),
  sortOrder: z.number(),
});

export const purchaseFormSchema = z.object({
  purchaseNumber: z.string().max(30).optional(),
  supplierName: z
    .string()
    .min(1, 'El nombre del proveedor es obligatorio')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  purchaseDate: z.string().min(1, 'La fecha de compra es obligatoria'),
  invoiceNumber: z
    .string()
    .min(1, 'El número de factura o documento es obligatorio')
    .max(50, 'El número no puede exceder 50 caracteres'),
  exchangeRate: z.number().positive('La tasa de cambio debe ser mayor a 0'),
  functionalCurrency: z.string().optional(),
  localCurrency: z.string().optional(),
  documentCurrency: z.string().min(1).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['DRAFT', 'COMPLETED', 'CANCELLED']),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'Debe incluir al menos un material en el detalle de la compra'),
});

export type PurchaseItemFormData = z.infer<typeof purchaseItemSchema>;
export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
