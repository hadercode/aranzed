import { Injectable, Inject } from '@nestjs/common';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';

import type {
  RawProductImportRow,
  BulkImportItemValidation,
  BulkImportValidationResult,
} from '../models/bulk-import.models';

@Injectable()
export class ProductImportValidatorService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly uomRepository: IUnitOfMeasureRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async validate(rawRows: RawProductImportRow[]): Promise<BulkImportValidationResult> {
    const [existingProducts, uoms, categories] = await Promise.all([
      this.productRepository.findAll(),
      this.uomRepository.findAll(),
      this.categoryRepository.findAll(),
    ]);

    const existingNamesSet = new Set(
      existingProducts.map((p) => this.normalizeText(p.name)),
    );

    const uomMap = new Map<string, { id: string }>();
    for (const u of uoms) {
      uomMap.set(this.normalizeText(u.code), u);
      uomMap.set(this.normalizeText(u.name), u);
    }

    const categoryMap = new Map<string, { id: string }>();
    for (const c of categories) {
      categoryMap.set(this.normalizeText(c.name), c);
    }

    const rowsResult: BulkImportItemValidation[] = [];
    const seenNamesInFile = new Map<string, number>();

    let validCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;

    for (const row of rawRows) {
      const errors: string[] = [];
      const warnings: string[] = [];
      let isDuplicate = false;

      // 1. Nombre y Duplicados
      const cleanName = row.rawName.trim();
      if (!cleanName) {
        errors.push('El nombre del artículo es obligatorio');
      } else if (cleanName.length > 150) {
        errors.push('El nombre no puede superar los 150 caracteres');
      } else {
        const normName = this.normalizeText(cleanName);
        if (seenNamesInFile.has(normName)) {
          errors.push(`Nombre duplicado: ya se incluyó en la fila ${seenNamesInFile.get(normName)} del archivo`);
          isDuplicate = true;
        } else {
          seenNamesInFile.set(normName, row.rowNumber);
        }

        if (existingNamesSet.has(normName)) {
          errors.push(`Ya existe un artículo en el sistema con el nombre "${cleanName}"`);
          isDuplicate = true;
        }
      }

      // 2. Tipo de Producto
      const resolvedType = this.resolveProductType(row.rawType);
      if (!resolvedType) {
        errors.push(`Tipo "${row.rawType || '(vacío)'}" no válido. Permitidos: TRADICIONAL, MATERIA_PRIMA, PRODUCTO_TERMINADO, SERVICIO`);
      }

      // 3. Unidad de Medida
      let resolvedUomId: string | null = null;
      const cleanUom = row.rawUom.trim();
      if (!cleanUom) {
        errors.push('La unidad de medida es obligatoria');
      } else {
        const matched = uomMap.get(this.normalizeText(cleanUom));
        if (matched) resolvedUomId = matched.id;
        else errors.push(`La unidad de medida "${cleanUom}" no existe en el sistema`);
      }

      // 4. Categoría
      let resolvedCategoryId: string | null = null;
      const cleanCategory = row.rawCategory.trim();
      if (cleanCategory) {
        const matched = categoryMap.get(this.normalizeText(cleanCategory));
        if (matched) resolvedCategoryId = matched.id;
        else errors.push(`La categoría "${cleanCategory}" no existe en el catálogo`);
      }

      // 5. Costos y Precios
      if (row.rawCost < 0) errors.push('El costo base no puede ser negativo');
      if (row.rawMargin < 0) errors.push('El margen de ganancia no puede ser negativo');
      if (row.rawPrice < 0) errors.push('El precio de venta no puede ser negativo');

      let finalCost = Math.max(0, row.rawCost);
      let finalMargin = Math.max(0, row.rawMargin);
      let finalPrice = Math.max(0, row.rawPrice);

      if (finalPrice === 0 && finalCost > 0) {
        finalPrice = Number((finalCost * (1 + finalMargin / 100)).toFixed(4));
        warnings.push(`Precio derivado automáticamente según Costo y Margen: ${finalPrice.toFixed(2)}`);
      } else if (finalPrice > 0 && finalCost > 0 && finalMargin === 0) {
        finalMargin = Number((((finalPrice - finalCost) / finalCost) * 100).toFixed(2));
      }

      // 6. Inventario y Activo
      const manageInventory = this.resolveBoolean(
        row.rawManageInventory,
        resolvedType !== ProductType.SERVICE,
      );
      const isActive = this.resolveBoolean(row.rawActive, true);

      if (row.rawDescription.length > 1000) errors.push('La descripción no puede superar 1000 caracteres');
      if (row.rawImageUrl.length > 500) errors.push('La URL de imagen no puede superar 500 caracteres');

      const status = isDuplicate ? 'DUPLICATE' : errors.length === 0 ? 'VALID' : 'INVALID';
      if (status === 'VALID') validCount++;
      else if (status === 'DUPLICATE') duplicateCount++;
      else invalidCount++;

      rowsResult.push({
        rowNumber: row.rowNumber,
        name: cleanName || `Fila ${row.rowNumber}`,
        type: resolvedType || ProductType.TRADITIONAL,
        uomNameOrCode: cleanUom,
        categoryName: cleanCategory || null,
        description: row.rawDescription.trim() || null,
        imageUrl: row.rawImageUrl.trim() || null,
        lastCost: finalCost,
        profitMargin: finalMargin,
        lastSalePrice: finalPrice,
        manageInventory,
        isActive,
        status,
        errors,
        warnings,
        resolvedUomId,
        resolvedCategoryId,
      });
    }

    return {
      totalRows: rowsResult.length,
      validCount,
      duplicateCount,
      invalidCount,
      canProcess: validCount > 0,
      rows: rowsResult,
    };
  }

  private normalizeText(value?: string | null): string {
    if (!value) return '';
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private resolveProductType(raw?: string): ProductType | null {
    if (!raw) return null;
    const clean = this.normalizeText(raw).replace(/[\s_-]+/g, '_');
    if (['tradicional', 'producto', 'traditional', 'mercancia'].includes(clean)) return ProductType.TRADITIONAL;
    if (['materia_prima', 'materiaprima', 'raw_material', 'insumo'].includes(clean)) return ProductType.RAW_MATERIAL;
    if (['producto_terminado', 'productoterminado', 'finished_good', 'terminado', 'elaborado'].includes(clean)) return ProductType.FINISHED_GOOD;
    if (['servicio', 'service'].includes(clean)) return ProductType.SERVICE;
    return null;
  }

  private resolveBoolean(raw: string | undefined, defaultValue: boolean): boolean {
    if (!raw) return defaultValue;
    const clean = this.normalizeText(raw);
    if (['si', 's', 'yes', 'y', 'true', '1', 'activo'].includes(clean)) return true;
    if (['no', 'n', 'false', '0', 'inactivo'].includes(clean)) return false;
    return defaultValue;
  }
}

