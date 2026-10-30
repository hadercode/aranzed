import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export type ImportRowStatus = 'VALID' | 'INVALID' | 'DUPLICATE';

export interface RawProductImportRow {
  rowNumber: number;
  rawName: string;
  rawType: string;
  rawUom: string;
  rawCategory: string;
  rawDescription: string;
  rawCost: number;
  rawMargin: number;
  rawPrice: number;
  rawManageInventory: string;
  rawActive: string;
  rawImageUrl: string;
}

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
