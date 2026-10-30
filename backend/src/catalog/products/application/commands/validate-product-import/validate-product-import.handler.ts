import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateProductImportCommand } from './validate-product-import.command';
import { ProductImportExcelParser } from '@/catalog/products/infrastructure/excel/product-import-excel.parser';
import { ProductImportValidatorService } from '@/catalog/products/application/services/product-import-validator.service';
import type { BulkImportValidationResult } from '../../models/bulk-import.models';

@CommandHandler(ValidateProductImportCommand)
export class ValidateProductImportHandler
  implements ICommandHandler<ValidateProductImportCommand, BulkImportValidationResult>
{
  constructor(
    private readonly excelParser: ProductImportExcelParser,
    private readonly validatorService: ProductImportValidatorService,
  ) {}

  async execute(
    command: ValidateProductImportCommand,
  ): Promise<BulkImportValidationResult> {
    const rawRows = await this.excelParser.parse(command.fileBuffer);
    return this.validatorService.validate(rawRows);
  }
}
