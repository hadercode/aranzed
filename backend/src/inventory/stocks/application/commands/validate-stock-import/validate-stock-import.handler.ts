import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateStockImportCommand } from './validate-stock-import.command';
import { StockImportExcelParser } from '@/inventory/stocks/infrastructure/excel/stock-import-excel.parser';
import { StockImportValidatorService } from '@/inventory/stocks/application/services/stock-import-validator.service';
import type { BulkStockImportValidationResult } from '../../models/stock-import.models';

@CommandHandler(ValidateStockImportCommand)
export class ValidateStockImportHandler
  implements ICommandHandler<ValidateStockImportCommand, BulkStockImportValidationResult>
{
  constructor(
    private readonly excelParser: StockImportExcelParser,
    private readonly validatorService: StockImportValidatorService,
  ) {}

  async execute(
    command: ValidateStockImportCommand,
  ): Promise<BulkStockImportValidationResult> {
    const rawRows = await this.excelParser.parse(command.fileBuffer);
    return this.validatorService.validate(rawRows);
  }
}
