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
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { GetProductImportTemplateQuery } from '@/catalog/products/application/queries/get-import-template/get-import-template.query';
import { ValidateProductImportCommand } from '@/catalog/products/application/commands/validate-product-import/validate-product-import.command';
import { ExecuteProductImportCommand } from '@/catalog/products/application/commands/execute-product-import/execute-product-import.command';

import {
  BulkImportValidationResultDto,
  ExecuteBulkImportDto,
  BulkImportSummaryDto,
} from '../dto/bulk-import-product.dto';

@ApiTags('catalog/products/import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('catalog/products/import')
export class ProductImportController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('template')
  @RequirePermissions('products:read')
  @ApiOperation({ summary: 'Descargar plantilla Excel para importación masiva de artículos' })
  @ApiResponse({
    status: 200,
    description: 'Archivo de plantilla .xlsx con columnas y catálogos de referencia',
  })
  async downloadImportTemplate(@Res() res: Response): Promise<void> {
    const buffer = await this.queryBus.execute<
      GetProductImportTemplateQuery,
      Buffer
    >(new GetProductImportTemplateQuery());

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="plantilla_articulos.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('validate')
  @RequirePermissions('products:manage')
  @ApiOperation({ summary: 'Validar archivo Excel para carga masiva de artículos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo Excel (.xlsx) con los artículos a importar',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Resultado de la validación fila por fila con verificación de duplicados y catálogos',
    type: BulkImportValidationResultDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async validateImportFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BulkImportValidationResultDto> {
    if (!file) {
      throw new BadRequestException(
        'Debe proporcionar un archivo Excel (.xlsx) en el campo "file"',
      );
    }
    return this.commandBus.execute<
      ValidateProductImportCommand,
      BulkImportValidationResultDto
    >(new ValidateProductImportCommand(file.buffer));
  }

  @Post('execute')
  @RequirePermissions('products:manage')
  @ApiOperation({ summary: 'Procesar e importar los artículos validados en el catálogo' })
  @ApiResponse({
    status: 201,
    description: 'Resumen del procesamiento masivo con total de registros creados',
    type: BulkImportSummaryDto,
  })
  async executeImport(
    @Body() dto: ExecuteBulkImportDto,
    @CurrentUser('id') userId?: string,
  ): Promise<BulkImportSummaryDto> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('No se proporcionaron artículos para importar');
    }
    return this.commandBus.execute<
      ExecuteProductImportCommand,
      BulkImportSummaryDto
    >(new ExecuteProductImportCommand(dto.items, userId));
  }
}
