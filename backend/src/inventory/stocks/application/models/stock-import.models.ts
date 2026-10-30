export type StockImportRowStatus = 'VALID' | 'INVALID' | 'DUPLICATE' | 'SKIPPED';

export interface RawStockImportRow {
  rowNumber: number;
  rawProductId: string;
  rawProductName: string;
  rawWarehouse: string;
  rawQuantity: number;
  rawUnitCost: number;
  rawBatchNumber: string;
  rawEntryDate: string;
}

export interface BulkStockImportItemValidation {
  rowNumber: number;
  productId: string;
  productName: string;
  uomSymbol: string;
  warehouseName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  batchNumber?: string | null;
  entryDate: string;
  status: StockImportRowStatus;
  errors: string[];
  warnings?: string[];
  resolvedProductId?: string | null;
  resolvedWarehouseId?: string | null;
}

export interface BulkStockImportValidationResult {
  totalRows: number;
  validCount: number;
  duplicateCount: number;
  invalidCount: number;
  skippedCount: number;
  canProcess: boolean;
  rows: BulkStockImportItemValidation[];
}

export interface BulkStockImportSummary {
  totalProcessed: number;
  createdCount: number;
  failedCount: number;
  errors: Array<{
    rowNumber?: number;
    name?: string;
    message: string;
  }>;
}

