import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import type { RawProductImportRow } from '@/catalog/products/application/models/bulk-import.models';
import {
  validateMagicBytes,
  sanitizeFormulaInjection,
  MAX_EXCEL_IMPORT_ROWS,
} from '@/core/security/file-security.util';

@Injectable()
export class ProductImportExcelParser {
  async parse(fileBuffer: Buffer): Promise<RawProductImportRow[]> {
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
    const rawRows: RawProductImportRow[] = [];

    for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      if (this.isRowEmpty(row)) continue;

      const rawName = this.getCellValueAsString(row.getCell(colIndexMap.name));
      if (rawName.startsWith('[EJEMPLO]')) continue;

      rawRows.push({
        rowNumber,
        rawName,
        rawType: this.getCellValueAsString(row.getCell(colIndexMap.type)),
        rawUom: this.getCellValueAsString(row.getCell(colIndexMap.uom)),
        rawCategory: this.getCellValueAsString(row.getCell(colIndexMap.category)),
        rawDescription: this.getCellValueAsString(row.getCell(colIndexMap.description)),
        rawCost: this.getCellValueAsNumber(row.getCell(colIndexMap.cost), 0),
        rawMargin: this.getCellValueAsNumber(row.getCell(colIndexMap.margin), 0),
        rawPrice: this.getCellValueAsNumber(row.getCell(colIndexMap.salePrice), 0),
        rawManageInventory: this.getCellValueAsString(row.getCell(colIndexMap.manageInventory)),
        rawActive: this.getCellValueAsString(row.getCell(colIndexMap.isActive)),
        rawImageUrl: this.getCellValueAsString(row.getCell(colIndexMap.imageUrl)),
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
      name: 1,
      type: 2,
      uom: 3,
      category: 4,
      description: 5,
      cost: 6,
      margin: 7,
      salePrice: 8,
      manageInventory: 9,
      isActive: 10,
      imageUrl: 11,
    };

    headerRow.eachCell((cell, colNumber) => {
      const text = this.getCellValueAsString(cell)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      if (text.includes('nombre') || text.includes('articulo') || text.includes('producto')) {
        map.name = colNumber;
      } else if (text.includes('tipo')) {
        map.type = colNumber;
      } else if (text.includes('unidad') || text.includes('uom') || text.includes('medida')) {
        map.uom = colNumber;
      } else if (text.includes('categoria')) {
        map.category = colNumber;
      } else if (text.includes('descrip')) {
        map.description = colNumber;
      } else if (text.includes('costo')) {
        map.cost = colNumber;
      } else if (text.includes('margen') || text.includes('ganancia') || text.includes('utilidad')) {
        map.margin = colNumber;
      } else if (text.includes('precio') || text.includes('venta')) {
        map.salePrice = colNumber;
      } else if (text.includes('inventario') || text.includes('stock')) {
        map.manageInventory = colNumber;
      } else if (text.includes('activo') || text.includes('estado')) {
        map.isActive = colNumber;
      } else if (text.includes('imagen') || text.includes('foto') || text.includes('url')) {
        map.imageUrl = colNumber;
      }
    });

    return map;
  }
}

