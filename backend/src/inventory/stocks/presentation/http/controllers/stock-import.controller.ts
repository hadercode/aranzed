import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { GetStockImportTemplateQuery } from '@/inventory/stocks/application/queries/get-stock-import-template/get-stock-import-template.query';
import { ValidateStockImportCommand } from '@/inventory/stocks/application/commands/validate-stock-import/validate-stock-import.command';
import { ExecuteStockImportCommand } from '@/inventory/stocks/application/commands/execute-stock-import/execute-stock-import.command';

import {
  BulkStockImportValidationResultDto,
  ExecuteBulkStockImportDto,
  BulkStockImportSummaryDto,
} from '../dto/bulk-import-stock.dto';

@ApiTags('inventory/stocks/import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/stocks/import')
export class StockImportController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('template')
  @ApiOperation({
    summary:
      'Descargar plantilla Excel pre-cargada con los artículos del catálogo para saldo inicial',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo de plantilla .xlsx pre-poblado con artículos y almacenes',
  })
  async downloadTemplate(@Res() res: Response): Promise<void> {
    const buffer = await this.queryBus.execute<
      GetStockImportTemplateQuery,
      Buffer
    >(new GetStockImportTemplateQuery());

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="plantilla_saldos_iniciales.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validar archivo Excel para carga de existencias y saldos iniciales' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo Excel (.xlsx) con los saldos iniciales',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Resultado de validación de artículos y almacenes existentes con cantidades',
    type: BulkStockImportValidationResultDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async validateFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BulkStockImportValidationResultDto> {
    if (!file) {
      throw new BadRequestException(
        'Debe proporcionar un archivo Excel (.xlsx) en el campo "file"',
      );
    }
    return this.commandBus.execute<
      ValidateStockImportCommand,
      BulkStockImportValidationResultDto
    >(new ValidateStockImportCommand(file.buffer));
  }

  @Post('execute')
  @ApiOperation({
    summary:
      'Procesar e ingresar los saldos iniciales validados generando capas FIFO y Kárdex',
  })
  @ApiResponse({
    status: 201,
    description: 'Resumen de artículos ingresados y transacciones creadas',
    type: BulkStockImportSummaryDto,
  })
  async executeImport(
    @Body() dto: ExecuteBulkStockImportDto,
    @CurrentUser('id') userId?: string,
  ): Promise<BulkStockImportSummaryDto> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron artículos con cantidad válida para importar',
      );
    }
    return this.commandBus.execute<
      ExecuteStockImportCommand,
      BulkStockImportSummaryDto
    >(new ExecuteStockImportCommand(dto.items, userId));
  }
}

