import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import { Category } from '@/catalog/categories/domain/entities/category.entity';

@Injectable()
export class ProductImportTemplateGenerator {
  async generate(uoms: UnitOfMeasure[], categories: Category[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MiniStore ERP';
    workbook.created = new Date();

    this.buildArticlesSheet(workbook, uoms, categories);
    this.buildCatalogGuideSheet(workbook, uoms, categories);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private buildArticlesSheet(
    workbook: ExcelJS.Workbook,
    uoms: UnitOfMeasure[],
    categories: Category[],
  ): void {
    const sheet = workbook.addWorksheet('Articulos', {
      views: [{ showGridLines: true }],
    });

    const headers = [
      'Nombre (*)',
      'Tipo (*)',
      'Unidad de Medida (*)',
      'Categoría',
      'Descripción',
      'Costo Base',
      'Margen %',
      'Precio Venta',
      'Maneja Inventario',
      'Activo',
      'URL Imagen',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
    });

    sheet.columns = [
      { width: 36 },
      { width: 24 },
      { width: 22 },
      { width: 26 },
      { width: 38 },
      { width: 14 },
      { width: 14 },
      { width: 16 },
      { width: 20 },
      { width: 14 },
      { width: 34 },
    ];

    const sampleUomCode = uoms.length > 0 ? uoms[0].code : 'UND';
    const sampleCategoryName = categories.length > 0 ? categories[0].name : 'General';

    const sampleRows = [
      ['[EJEMPLO] Hamburguesa Clásica', 'PRODUCTO_TERMINADO', sampleUomCode, sampleCategoryName, 'Hamburguesa doble carne', 4.5, 40, 6.3, 'SI', 'SI', ''],
      ['[EJEMPLO] Carne Molida de Res', 'MATERIA_PRIMA', sampleUomCode, sampleCategoryName, 'Carne fresca para producción', 7.2, 0, 0, 'SI', 'SI', ''],
      ['[EJEMPLO] Servicio de Delivery', 'SERVICIO', sampleUomCode, sampleCategoryName, 'Despacho a domicilio', 0, 0, 3.0, 'NO', 'SI', ''],
    ];

    for (const rowData of sampleRows) {
      const addedRow = sheet.addRow(rowData);
      addedRow.height = 20;
      addedRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
        cell.border = {
          top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        };
        if ([6, 7, 8].includes(colNumber)) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0.00';
        } else if ([2, 3, 9, 10].includes(colNumber)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    }
  }

  private buildCatalogGuideSheet(
    workbook: ExcelJS.Workbook,
    uoms: UnitOfMeasure[],
    categories: Category[],
  ): void {
    const sheet = workbook.addWorksheet('Catalogos y Guia', {
      views: [{ showGridLines: true }],
    });

    sheet.columns = [{ width: 28 }, { width: 45 }, { width: 5 }, { width: 24 }, { width: 35 }];

    sheet.mergeCells('A1:E1');
    const title = sheet.getCell('A1');
    title.value = 'GUÍA DE LLENADO Y CATÁLOGOS DISPONIBLES EN EL SISTEMA';
    title.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
    title.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(1).height = 30;

    sheet.mergeCells('A3:E3');
    const s1 = sheet.getCell('A3');
    s1.value = '1. REGLAS Y VALIDACIONES DE LAS COLUMNAS';
    s1.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    s1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    sheet.getRow(3).height = 22;

    const rules = [
      ['Nombre (*)', 'Obligatorio. Único en el sistema. Máx 150 caracteres. No puede repetirse en el archivo ni en BD.'],
      ['Tipo (*)', 'Obligatorio. Valores admitidos: TRADICIONAL, MATERIA_PRIMA, PRODUCTO_TERMINADO, SERVICIO.'],
      ['Unidad de Medida (*)', 'Obligatorio. Debe coincidir con el Código o Nombre de una unidad registrada abajo.'],
      ['Categoría', 'Opcional. Si se especifica, debe coincidir exactamente con una categoría registrada abajo.'],
      ['Costo Base / Margen %', 'Opcionales (default 0). Valores numéricos mayores o iguales a 0.'],
      ['Precio Venta', 'Opcional. Si está vacío o en 0 y hay Costo, se calcula: Costo * (1 + Margen%).'],
      ['Maneja Inventario / Activo', 'Opcionales: SI o NO. (Por defecto los servicios no manejan inventario).'],
      ['Filas [EJEMPLO]', 'Las filas que comiencen con "[EJEMPLO]" son omitidas automáticamente.'],
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
    sheet.mergeCells(`A${rowIdx}:B${rowIdx}`);
    sheet.getCell(`A${rowIdx}`).value = '2. TIPOS DE PRODUCTO VÁLIDOS';
    sheet.getCell(`A${rowIdx}`).font = { name: 'Segoe UI', size: 10, bold: true };
    sheet.getCell(`A${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

    sheet.mergeCells(`D${rowIdx}:E${rowIdx}`);
    sheet.getCell(`D${rowIdx}`).value = '3. UNIDADES DE MEDIDA EN EL SISTEMA';
    sheet.getCell(`D${rowIdx}`).font = { name: 'Segoe UI', size: 10, bold: true };
    sheet.getCell(`D${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    rowIdx++;

    const typesInfo = [
      ['TRADICIONAL', 'Artículo estándar comercial para compra y venta directa'],
      ['MATERIA_PRIMA', 'Insumo o material consumido en producción'],
      ['PRODUCTO_TERMINADO', 'Artículo elaborado a partir de recetas o ensamble'],
      ['SERVICIO', 'Prestación o servicio intangible (no maneja stock)'],
    ];

    const maxItems = Math.max(typesInfo.length, uoms.length);
    for (let i = 0; i < maxItems; i++) {
      const r = sheet.getRow(rowIdx);
      if (typesInfo[i]) {
        r.getCell(1).value = typesInfo[i][0];
        r.getCell(1).font = { name: 'Segoe UI', size: 9, bold: true };
        r.getCell(2).value = typesInfo[i][1];
        r.getCell(2).font = { name: 'Segoe UI', size: 9 };
      }
      if (uoms[i]) {
        r.getCell(4).value = uoms[i].code;
        r.getCell(4).font = { name: 'Segoe UI', size: 9, bold: true };
        r.getCell(5).value = uoms[i].name;
        r.getCell(5).font = { name: 'Segoe UI', size: 9 };
      }
      rowIdx++;
    }

    rowIdx += 1;
    sheet.mergeCells(`A${rowIdx}:E${rowIdx}`);
    sheet.getCell(`A${rowIdx}`).value = '4. CATEGORÍAS REGISTRADAS EN EL SISTEMA';
    sheet.getCell(`A${rowIdx}`).font = { name: 'Segoe UI', size: 10, bold: true };
    sheet.getCell(`A${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    rowIdx++;

    if (categories.length === 0) {
      sheet.getRow(rowIdx).getCell(1).value = '(No hay categorías registradas)';
    } else {
      for (const cat of categories) {
        sheet.getRow(rowIdx).getCell(1).value = cat.name;
        sheet.getRow(rowIdx).getCell(1).font = { name: 'Segoe UI', size: 9 };
        rowIdx++;
      }
    }
  }
}

