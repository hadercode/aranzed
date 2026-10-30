import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import type { RawStockImportRow } from '@/inventory/stocks/application/models/stock-import.models';
import {
  validateMagicBytes,
  sanitizeFormulaInjection,
  MAX_EXCEL_IMPORT_ROWS,
} from '@/core/security/file-security.util';

@Injectable()
export class StockImportExcelParser {
  async parse(fileBuffer: Buffer): Promise<RawStockImportRow[]> {
    // 1. Verificación obligatoria de Magic Bytes (firma binaria real de archivo Excel)
    validateMagicBytes(fileBuffer, 'excel');

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(fileBuffer as any);
    } catch {
      throw new BadRequestException(
        'El archivo subido no es un archivo Excel válido o está corrupto (.xlsx).',
      );
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no contiene ninguna hoja de cálculo.');
    }

    // 2. Control de denegación de servicio (DoS) por número excesivo de filas
    const rowCount = worksheet.rowCount;
    if (rowCount > MAX_EXCEL_IMPORT_ROWS) {
      throw new BadRequestException(
        `El archivo contiene ${rowCount} filas, superando el límite máximo de ${MAX_EXCEL_IMPORT_ROWS} filas por importación.`,
      );
    }

    const colIndexMap = this.mapHeaderColumns(worksheet.getRow(1));
    const rawRows: RawStockImportRow[] = [];

    for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      if (this.isRowEmpty(row)) continue;

      const rawProductName = this.getCellValueAsString(row.getCell(colIndexMap.productName));
      const rawQuantity = this.getCellValueAsNumber(row.getCell(colIndexMap.quantity), 0);

      // Si la fila está completamente vacía o no tiene nombre, se ignora
      if (!rawProductName && rawQuantity === 0) continue;

      rawRows.push({
        rowNumber,
        rawProductId: this.getCellValueAsString(row.getCell(colIndexMap.productId)),
        rawProductName,
        rawWarehouse: this.getCellValueAsString(row.getCell(colIndexMap.warehouse)),
        rawQuantity,
        rawUnitCost: this.getCellValueAsNumber(row.getCell(colIndexMap.unitCost), 0),
        rawBatchNumber: this.getCellValueAsString(row.getCell(colIndexMap.batchNumber)),
        rawEntryDate: this.getCellValueAsString(row.getCell(colIndexMap.entryDate)),
      });
    }

    return rawRows;
  }

  private isRowEmpty(row: ExcelJS.Row): boolean {
    let empty = true;
    row.eachCell((cell) => {
      if (cell.value !== null && cell.value !== undefined && String(cell.value).trim() !== '') {
        empty = false;
      }
    });
    return empty;
  }

  private getCellValueAsString(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) return '';
    let raw = '';
    if (typeof cell.value === 'object') {
      if ('text' in cell.value) raw = String((cell.value as any).text).trim();
      else if ('result' in cell.value) raw = String((cell.value as any).result).trim();
    } else {
      raw = String(cell.value).trim();
    }
    return sanitizeFormulaInjection(raw);
  }

  private getCellValueAsNumber(cell: ExcelJS.Cell, defaultValue = 0): number {
    if (!cell || cell.value === null || cell.value === undefined) return defaultValue;
    let numVal = defaultValue;
    if (typeof cell.value === 'number') {
      numVal = cell.value;
    } else if (typeof cell.value === 'object') {
      if ('result' in cell.value && typeof (cell.value as any).result === 'number') {
        numVal = (cell.value as any).result;
      }
    } else {
      const parsed = parseFloat(String(cell.value).replace(/,/g, '.'));
      if (!isNaN(parsed)) numVal = parsed;
    }
    return isNaN(numVal) ? defaultValue : numVal;
  }

  private mapHeaderColumns(headerRow: ExcelJS.Row) {
    const map = {
      productId: 1,
      productName: 2,
      warehouse: 5,
      quantity: 6,
      unitCost: 7,
      batchNumber: 8,
      entryDate: 9,
    };

    headerRow.eachCell((cell, colNumber) => {
      const text = this.getCellValueAsString(cell)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      if (text.includes('id') && text.includes('art')) {
        map.productId = colNumber;
      } else if (text.includes('nombre') || text.includes('art') || text.includes('producto')) {
        map.productName = colNumber;
      } else if (text.includes('almacen') || text.includes('deposito')) {
        map.warehouse = colNumber;
      } else if (text.includes('cantidad') || text.includes('cant') || text.includes('fisic')) {
        map.quantity = colNumber;
      } else if (text.includes('costo') || text.includes('precio')) {
        map.unitCost = colNumber;
      } else if (text.includes('lote') || text.includes('batch')) {
        map.batchNumber = colNumber;
      } else if (text.includes('fecha') || text.includes('date')) {
        map.entryDate = colNumber;
      }
    });

    return map;
  }
}

