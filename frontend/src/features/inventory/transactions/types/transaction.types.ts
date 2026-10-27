import type { Warehouse } from '../../warehouses/types';
import type { InventoryReason } from '../../reasons/types';

export type InventoryTransactionType = 'RECEPTION' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
export type InventoryTransactionStatus = 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export interface InventoryTransactionItem {
  id?: string;
  transactionId?: string;
  productId: string;
  product?: { id: string; name: string; sku?: string; imageUrl?: string };
  variantId?: string | null;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost?: number | null;
  secQuantity?: number | null;
  secUomSymbol?: string | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  customComment?: string | null;
}

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  type: InventoryTransactionType;
  reasonId?: string | null;
  reason?: InventoryReason | null;
  originWarehouseId?: string | null;
  originWarehouse?: Warehouse | null;
  destWarehouseId?: string | null;
  destWarehouse?: Warehouse | null;
  status: InventoryTransactionStatus;
  movementDate: string;
  referenceEntityType?: string | null;
  referenceEntityId?: string | null;
  notes?: string | null;
  documents?: string[] | null;
  items: InventoryTransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryTransactionItemDto {
  productId: string;
  variantId?: string;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost?: number;
  secQuantity?: number;
  secUomSymbol?: string;
  batchNumber?: string;
  expiryDate?: string;
  customComment?: string;
}

export interface CreateInventoryTransactionDto {
  transactionNumber?: string;
  type: InventoryTransactionType;
  reasonId?: string;
  originWarehouseId?: string;
  destWarehouseId?: string;
  status?: InventoryTransactionStatus;
  movementDate?: string;
  referenceEntityType?: string;
  referenceEntityId?: string;
  notes?: string;
  documents?: string[];
  items: CreateInventoryTransactionItemDto[];
}

export interface UpdateInventoryTransactionDto {
  notes?: string;
  movementDate?: string;
  status?: InventoryTransactionStatus;
}

export interface TransactionFilters {
  type?: InventoryTransactionType;
  status?: InventoryTransactionStatus;
  warehouseId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTransactionsResponse {
  data: InventoryTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

