import type { Warehouse } from '../../warehouses/types';

export interface InventoryStock {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  productId: string;
  product?: { id: string; name: string; sku?: string; imageUrl?: string };
  variantId?: string | null;
  skuSnapshot: string;
  productNameSnapshot: string;
  batchNumber?: string | null;
  entryDate: string;
  uomOriginalQty: number;
  physicalQty: number;
  reservedQty: number;
  availableQty: number;
  uomSymbol: string;
  secUomOriginalQty?: number | null;
  secPhysicalQty?: number | null;
  secReservedQty?: number | null;
  secAvailableQty?: number | null;
  secUomSymbol?: string | null;
  unitCost: number;
  currencyCode: string;
  exchangeRate: number;
  totalCostLocal: number;
  totalCostUSD: number;
  isDepleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockReservation {
  id: string;
  stockId: string;
  stock?: InventoryStock;
  referenceType: string;
  referenceId: string;
  referenceItemId?: string | null;
  reservedQty: number;
  secReservedQty?: number | null;
  status: 'ACTIVE' | 'RELEASED' | 'CONSUMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface StockLedgerEntry {
  id: string;
  stockId: string;
  stock?: InventoryStock;
  transactionItemId: string;
  transactionItem?: any;
  entryDate: string;
  previousQty?: number;
  movementQty?: number;
  quantity?: number;
  remainingQty?: number;
  previousReservedQty?: number;
  movementReservedQty?: number;
  remainingReservedQty?: number;
  unitCost: number;
  totalCost: number;
  currencyCode?: string;
  createdAt: string;
}

export interface InventoryAdjustmentReport {
  transactionId: string;
  transactionNumber: string;
  movementDate: string;
  reasonName: string;
  warehouseName: string;
  totalItems: number;
  totalDiffQty: number;
  totalCostImpactUsd: number;
  totalCostImpactLocal: number;
}

export interface CreateStockReservationDto {
  stockId: string;
  referenceType: string;
  referenceId: string;
  referenceItemId?: string;
  reservedQty: number;
  secReservedQty?: number;
}

export interface StockFilters {
  warehouseId?: string;
  productId?: string;
  search?: string;
  excludeDepleted?: boolean;
}
