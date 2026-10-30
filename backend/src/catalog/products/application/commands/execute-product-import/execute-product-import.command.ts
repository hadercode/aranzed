import type { BulkImportItemValidation } from '../../models/bulk-import.models';

export class ExecuteProductImportCommand {
  constructor(
    public readonly items: BulkImportItemValidation[],
    public readonly userId?: string,
  ) {}
}
