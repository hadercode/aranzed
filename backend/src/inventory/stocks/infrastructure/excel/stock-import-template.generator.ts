import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Product } from '@/catalog/products/domain/entities/product.entity';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';

@Injectable()
export class StockImportTemplateGenerator {
  async generate(
    products: Product[],
    warehouses: WarehouseOrmEntity[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MiniStore ERP';
    workbook.created = new Date();

    this.buildInitialStockSheet(workbook, products, warehouses);
    this.buildWarehousesGuideSheet(workbook, warehouses);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private buildInitialStockSheet(
    workbook: ExcelJS.Workbook,
    products: Product[],
    warehouses: WarehouseOrmEntity[],
  ): void {
    const sheet = workbook.addWorksheet('Saldos Iniciales', {
      views: [{ showGridLines: true }],
    });

    const headers = [
      'ID Artículo (Referencial)',
      'Nombre del Artículo (*)',
      'Tipo de Producto',
      'Unidad de Medida',
      'Almacén Destino (*)',
      'Cantidad Inicial (*)',
      'Costo Unitario (*)',
      'Número de Lote',
      'Fecha de Entrada (YYYY-MM-DD)',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Slate-800
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
    });

    sheet.columns = [
      { width: 38 }, // ID Artículo
      { width: 36 }, // Nombre del Artículo
      { width: 22 }, // Tipo
      { width: 18 }, // UoM
      { width: 28 }, // Almacén
      { width: 20 }, // Cantidad Inicial
      { width: 18 }, // Costo Unitario
      { width: 20 }, // Número de Lote
      { width: 28 }, // Fecha de Entrada
    ];

    const defaultWarehouseName = warehouses.length > 0 ? warehouses[0].name : '';
    const todayStr = new Date().toISOString().slice(0, 10);

    // Si no hay productos en catálogo, colocamos una fila informativa
    if (products.length === 0) {
      const emptyRow = sheet.addRow([
        '',
        '(No hay artículos registrados en el catálogo. Registre productos antes de cargar existencias)',
        '',
        '',
        '',
        0,
        0,
        '',
        '',
      ]);
      emptyRow.font = { italic: true, color: { argb: 'FF64748B' } };
      return;
    }

    // Pre-cargar todos los artículos del catálogo que manejan inventario
    for (const prod of products) {
      const uomCode = prod.uom?.code || prod.uom?.name || 'UND';
      const lastCost = Number(prod.lastCost) || 0;

      const row = sheet.addRow([
        prod.id,
        prod.name,
        prod.type,
        uomCode,
        defaultWarehouseName,
        '', // Cantidad en blanco para que el usuario ingrese las que apliquen
        lastCost,
        '', // Lote opcional
        todayStr,
      ]);

      row.height = 20;
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9 };
        cell.border = {
          top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        };

        // Columna 1 (ID): color atenuado
        if (colNumber === 1) {
          cell.font = { name: 'Consolas', size: 8, color: { argb: 'FF94A3B8' } };
        } else if (colNumber === 6 || colNumber === 7) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0.00';
        } else if (colNumber === 3 || colNumber === 4 || colNumber === 9) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    }
  }

  private buildWarehousesGuideSheet(
    workbook: ExcelJS.Workbook,
    warehouses: WarehouseOrmEntity[],
  ): void {
    const sheet = workbook.addWorksheet('Almacenes y Guia', {
      views: [{ showGridLines: true }],
    });

    sheet.columns = [{ width: 32 }, { width: 50 }, { width: 5 }, { width: 32 }, { width: 40 }];

    // Título Principal
    sheet.mergeCells('A1:E1');
    const title = sheet.getCell('A1');
    title.value = 'GUÍA DE LLENADO DE SALDOS INICIALES Y ALMACENES DISPONIBLES';
    title.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }; // Teal-700
    title.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(1).height = 30;

    // Reglas de llenado
    sheet.mergeCells('A3:E3');
    const s1 = sheet.getCell('A3');
    s1.value = '1. INSTRUCCIONES Y REGLAS DE CARGA';
    s1.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    s1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    sheet.getRow(3).height = 22;

    const rules = [
      ['Artículos Pre-cargados', 'La primera hoja ya contiene todos los artículos de tu catálogo que gestionan inventario.'],
      ['Artículos No Existentes', 'No es posible cargar stock para productos no registrados previamente en el catálogo.'],
      ['Filas en Blanco o en Cero', 'Si un artículo no tiene existencias que cargar, deja la Cantidad vacía o en 0; el sistema lo omitirá sin errores.'],
      ['Almacén Destino (*)', 'Debe coincidir exactamente con el nombre de uno de los almacenes registrados abajo.'],
      ['Cantidad Inicial (*)', 'Número positivo mayor a cero (ej: 100, 25.5).'],
      ['Costo Unitario (*)', 'Costo base o costo de adquisición del lote inicial. Debe ser mayor o igual a cero.'],
      ['Lote y Fecha', 'El número de lote es opcional. La fecha debe tener formato YYYY-MM-DD (ej: 2026-10-29).'],
    ];

    let rowIdx = 4;
    for (const [col, desc] of rules) {
      const r = sheet.getRow(rowIdx);
      r.getCell(1).value = col;
      r.getCell(1).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF1E293B' } };
      sheet.mergeCells(`B${rowIdx}:E${rowIdx}`);
      r.getCell(2).value = desc;
      r.getCell(2).font = { name: 'Segoe UI', size: 9, color: { argb: 'FF334155' } };
      rowIdx++;
    }

    rowIdx += 1;
    sheet.mergeCells(`A${rowIdx}:E${rowIdx}`);
    const s2 = sheet.getCell(`A${rowIdx}`);
    s2.value = '2. ALMACENES REGISTRADOS EN EL SISTEMA';
    s2.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    s2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    rowIdx++;

    // Sub-encabezados de almacenes
    const subH = sheet.getRow(rowIdx);
    subH.getCell(1).value = 'Nombre de Almacén (Usar este nombre exacto)';
    subH.getCell(2).value = 'Código / Ubicación';
    sheet.mergeCells(`B${rowIdx}:E${rowIdx}`);
    [1, 2].forEach((c) => {
      subH.getCell(c).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
      subH.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    });
    rowIdx++;

    if (warehouses.length === 0) {
      const emptyW = sheet.getRow(rowIdx);
      emptyW.getCell(1).value = '(No hay almacenes registrados en el sistema)';
      emptyW.getCell(1).font = { italic: true };
    } else {
      for (const w of warehouses) {
        const r = sheet.getRow(rowIdx);
        r.getCell(1).value = w.name;
        r.getCell(1).font = { name: 'Segoe UI', size: 9, bold: true };
        sheet.mergeCells(`B${rowIdx}:E${rowIdx}`);
        r.getCell(2).value = w.code || w.location || '-';
        r.getCell(2).font = { name: 'Segoe UI', size: 9 };
        rowIdx++;
      }
    }
  }
}
