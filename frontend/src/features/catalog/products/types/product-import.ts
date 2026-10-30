import type { ProductType } from './product';

export type ImportRowStatus = 'VALID' | 'INVALID' | 'DUPLICATE';

export interface BulkImportItemValidation {
  rowNumber: number;
  name: string;
  type: ProductType;
  uomNameOrCode: string;
  categoryName?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  lastCost: number;
  profitMargin: number;
  lastSalePrice: number;
  manageInventory: boolean;
  isActive: boolean;
  status: ImportRowStatus;
  errors: string[];
  warnings?: string[];
  resolvedUomId?: string | null;
  resolvedCategoryId?: string | null;
}

export interface BulkImportValidationResult {
  totalRows: number;
  validCount: number;
  duplicateCount: number;
  invalidCount: number;
  canProcess: boolean;
  rows: BulkImportItemValidation[];
}

export interface BulkImportSummary {
  totalProcessed: number;
  createdCount: number;
  failedCount: number;
  errors: Array<{
    rowNumber?: number;
    name?: string;
    message: string;
  }>;
}
