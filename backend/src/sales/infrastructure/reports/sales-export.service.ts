import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';

@Injectable()
export class SalesExportService {
  async generateSalesExcel(sales: Sale[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MiniStore ERP';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Ventas y Cotizaciones', {
      views: [{ showGridLines: true }],
    });

    // 1. Título y membrete
    worksheet.mergeCells('A1:J1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'REPORTE GENERAL DE VENTAS Y COTIZACIONES';
    titleCell.font = {
      name: 'Arial',
      size: 14,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    worksheet.mergeCells('A2:J2');
    const subtitleCell = worksheet.getCell('A2');
    subtitleCell.value = `Generado el: ${new Date().toLocaleString()} | Total Registros: ${sales.length}`;
    subtitleCell.font = {
      name: 'Arial',
      size: 9,
      italic: true,
      color: { argb: 'FF64748B' },
    };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(2).height = 18;

    // Fila vacía
    worksheet.addRow([]);

    // 2. Encabezados de Columna
    const headers = [
      'N° Documento',
      'Tipo',
      'Condición',
      'Vencimiento',
      'Fecha Emisión',
      'Estado',
      'Estado Pago',
      'Cliente',
      'C.I. / RIF',
      'Tasa Cambio',
      'Total (USD)',
      'Total (VES)',
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.height = 24;
    headerRow.eachCell((cell) => {
      cell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF334155' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF94A3B8' } },
        right: { style: 'thin', color: { argb: 'FF94A3B8' } },
      };
    });

    // 3. Filas de Datos
    let startRow = 5;
    sales.forEach((sale) => {
      const isQuotation = sale.saleType === SaleType.QUOTATION;
      const row = worksheet.addRow([
        sale.saleNumber,
        isQuotation ? 'COTIZACIÓN' : 'VENTA DIRECTA',
        sale.paymentTerm || 'CONTADO',
        sale.dueDate ? new Date(sale.dueDate).toLocaleDateString() : 'N/A',
        new Date(sale.saleDate).toLocaleDateString(),
        sale.status,
        sale.paidStatus || 'PENDIENTE',
        sale.customerName,
        sale.customerTaxId || 'N/A',
        Number(sale.exchangeRate || 1.0),
        Number(sale.total || 0),
        Number(sale.totalLocal || 0),
      ]);

      row.height = 20;

      // Formato numérico y alineación
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(8).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };

      // Tasa
      const cellRate = row.getCell(10);
      cellRate.numFmt = '#,##0.0000';
      cellRate.alignment = { horizontal: 'right', vertical: 'middle' };

      // Totales
      const cellTotalUSD = row.getCell(11);
      cellTotalUSD.numFmt = '"$"#,##0.00';
      cellTotalUSD.alignment = { horizontal: 'right', vertical: 'middle' };
      cellTotalUSD.font = { bold: true };

      const cellTotalLocal = row.getCell(12);
      cellTotalLocal.numFmt = '"Bs."#,##0.00';
      cellTotalLocal.alignment = { horizontal: 'right', vertical: 'middle' };
      cellTotalLocal.font = { bold: true };

      // Bordes tenues
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      });

      startRow++;
    });

    // 4. Fila de Totales Generales
    if (sales.length > 0) {
      const summaryRow = worksheet.addRow([
        'TOTALES',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        { formula: `SUM(K5:K${startRow - 1})` },
        { formula: `SUM(L5:L${startRow - 1})` },
      ]);

      summaryRow.height = 24;
      worksheet.mergeCells(`A${startRow}:J${startRow}`);
      const mergedLabel = worksheet.getCell(`A${startRow}`);
      mergedLabel.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: 'FF1E293B' },
      };
      mergedLabel.alignment = { horizontal: 'right', vertical: 'middle' };

      const totalUSDCell = summaryRow.getCell(11);
      totalUSDCell.numFmt = '"$"#,##0.00';
      totalUSDCell.font = {
        name: 'Arial',
        size: 11,
        bold: true,
        color: { argb: 'FF059669' },
      };
      totalUSDCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFECFDF5' },
      };

      const totalLocalCell = summaryRow.getCell(12);
      totalLocalCell.numFmt = '"Bs."#,##0.00';
      totalLocalCell.font = {
        name: 'Arial',
        size: 11,
        bold: true,
        color: { argb: 'FF0284C7' },
      };
      totalLocalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F9FF' },
      };
    }

    // 5. Autoajustar anchos de columna
    worksheet.columns.forEach((column) => {
      let maxLen = 12;
      column.eachCell?.({ includeEmpty: false }, (cell) => {
        const val =
          cell.value != null
            ? typeof cell.value === 'object'
              ? JSON.stringify(cell.value)
              : String(cell.value)
            : '';
        if (val.length > maxLen) {
          maxLen = Math.min(val.length + 3, 35);
        }
      });
      column.width = maxLen;
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }
}
