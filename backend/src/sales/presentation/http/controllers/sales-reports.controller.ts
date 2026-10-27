import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';

import { FindSalesUseCase } from '@/sales/application/queries/find-sales/find-sales.use-case';
import { FindSaleByIdUseCase } from '@/sales/application/queries/find-sale-by-id/find-sale-by-id.use-case';
import { SalesPdfService } from '@/sales/infrastructure/reports/sales-pdf.service';
import { SalesExportService } from '@/sales/infrastructure/reports/sales-export.service';

import { FindSalesQueryDto } from '../dto';

@ApiTags('Sales Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sales')
export class SalesReportsController {
  constructor(
    private readonly findSalesUseCase: FindSalesUseCase,
    private readonly findSaleByIdUseCase: FindSaleByIdUseCase,
    private readonly salesPdfService: SalesPdfService,
    private readonly salesExportService: SalesExportService,
  ) {}

  @Get('export/excel')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Generar y descargar reporte consolidado en Excel (.xlsx)',
  })
  async exportExcel(@Query() query: FindSalesQueryDto, @Res() res: Response) {
    const { sales } = await this.findSalesUseCase.execute({
      ...query,
      limit: 10000,
      offset: 0,
    });
    const buffer = await this.salesExportService.generateSalesExcel(sales);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte_ventas.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('export/pdf')
  @RequirePermissions('sales:read')
  @ApiOperation({ summary: 'Generar y descargar reporte consolidado en PDF' })
  async exportPdf(@Query() query: FindSalesQueryDto, @Res() res: Response) {
    const { sales } = await this.findSalesUseCase.execute({
      ...query,
      limit: 10000,
      offset: 0,
    });

    let desc = '';
    if (query.startDate || query.endDate) {
      desc = `Desde: ${query.startDate || 'Inicio'} Hasta: ${query.endDate || 'Hoy'}`;
    }
    if (query.saleType) {
      desc += `${desc ? ' | ' : ''}Tipo: ${query.saleType}`;
    }
    if (query.status) {
      desc += `${desc ? ' | ' : ''}Estado: ${query.status}`;
    }

    const buffer = await this.salesPdfService.generateSalesListPdf(sales, desc);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="reporte_ventas.pdf"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/pdf')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary:
      'Generar e imprimir comprobante comercial en PDF de una venta o cotización',
  })
  async getSalePdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const sale = await this.findSaleByIdUseCase.execute(id);
    const buffer = await this.salesPdfService.generateSalePdf(sale);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sale.saleNumber}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
