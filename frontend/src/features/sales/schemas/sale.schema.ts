import { z } from 'zod';

export const saleItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'El producto es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria').max(255),
  productType: z.string().optional(),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0, 'El precio unitario no puede ser negativo'),
  unitCost: z.number().optional(),
  discountRate: z.number().min(0).max(100, 'El descuento no puede superar el 100%'),
  isTaxable: z.boolean(),
  taxRate: z.number().min(0, 'La tasa de IVA no puede ser negativa'),
  sortOrder: z.number().optional(),
  unitPriceLocal: z.number().optional(),
  subtotalLocal: z.number().optional(),
  totalLocal: z.number().optional(),
});

export const saleFormSchema = z
  .object({
    saleNumber: z.string().max(50).optional(),
    saleType: z.enum(['QUOTATION', 'DIRECT_SALE']),
    paymentTerm: z.enum(['CONTADO', 'CREDITO']),
    dueDate: z.string().optional().nullable(),
    paidStatus: z.enum(['PENDIENTE', 'ABONADO', 'PAGADO']).optional(),
    status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'CANCELLED']),
    customerName: z
      .string()
      .min(1, 'El nombre del cliente es obligatorio')
      .max(150, 'El nombre no puede exceder 150 caracteres'),
    customerTaxId: z.string().max(50).optional(),
    customerEmail: z
      .string()
      .email('El correo electrónico no es válido')
      .max(150)
      .optional()
      .or(z.literal('')),
    customerPhone: z.string().max(50).optional(),
    customerAddress: z.string().max(500).optional(),
    notes: z.string().max(1000).optional(),
    paymentMethod: z
      .enum(['CASH', 'TRANSFER', 'CARD', 'CREDIT', 'OTHER'])
      .optional(),
    paymentNotes: z.string().max(500).optional(),
    saleDate: z.string().min(1, 'La fecha de emisión es obligatoria'),
    validUntil: z.string().optional().nullable(),
    exchangeRate: z.number().positive('La tasa de cambio debe ser mayor a 0'),
    functionalCurrency: z.string().optional(),
    localCurrency: z.string().optional(),
    documentCurrency: z.string().optional(),
    items: z
      .array(saleItemSchema)
      .min(1, 'Debe incluir al menos un producto en el detalle'),
  })
  .refine(
    (data) => {
      if (data.paymentTerm === 'CREDITO') {
        return Boolean(data.dueDate && data.dueDate.trim().length > 0);
      }
      return true;
    },
    {
      message: 'La fecha de vencimiento es obligatoria para ventas a crédito',
      path: ['dueDate'],
    },
  );

export type SaleItemFormData = z.infer<typeof saleItemSchema>;
export type SaleFormData = z.infer<typeof saleFormSchema>;
