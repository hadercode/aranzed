import type { BulkStockImportItemValidation } from '../../models/stock-import.models';

export class ExecuteStockImportCommand {
  constructor(
    public readonly items: BulkStockImportItemValidation[],
    public readonly userId?: string,
  ) {}
}

