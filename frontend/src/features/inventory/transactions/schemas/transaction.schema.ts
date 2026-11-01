import { z } from 'zod';

export const transactionItemSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  cost: z.number().nonnegative().optional(),
  secQuantity: z.number().optional(),
  secUomSymbol: z.string().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  customComment: z.string().optional(),
});

export const transactionHeaderSchema = z.object({
  type: z.enum(['RECEPTION', 'ISSUE', 'TRANSFER', 'ADJUSTMENT']),
  movementDate: z.string().min(1, 'La fecha es requerida'),
  originWarehouseId: z.string().optional(),
  destWarehouseId: z.string().optional(),
  reasonId: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  referenceEntityType: z.string().optional(),
  referenceEntityId: z.string().optional(),
  notes: z.string().optional(),
});

export type TransactionHeaderData = z.infer<typeof transactionHeaderSchema>;
export type TransactionItemData = z.infer<typeof transactionItemSchema>;

