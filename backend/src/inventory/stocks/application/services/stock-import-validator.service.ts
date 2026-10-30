import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';

import type {
  RawStockImportRow,
  BulkStockImportItemValidation,
  BulkStockImportValidationResult,
} from '../models/stock-import.models';

@Injectable()
export class StockImportValidatorService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @InjectRepository(WarehouseOrmEntity)
    private readonly warehouseRepo: Repository<WarehouseOrmEntity>,
  ) {}

  async validate(rawRows: RawStockImportRow[]): Promise<BulkStockImportValidationResult> {
    const [existingProducts, existingWarehouses] = await Promise.all([
      this.productRepository.findAll(),
      this.warehouseRepo.find(),
    ]);

    // Mapeo de productos por ID y por nombre normalizado
    const productById = new Map<string, any>();
    const productByName = new Map<string, any>();
    for (const p of existingProducts) {
      productById.set(p.id, p);
      productByName.set(this.normalizeText(p.name), p);
    }

    // Mapeo de almacenes por ID y por nombre normalizado
    const warehouseById = new Map<string, WarehouseOrmEntity>();
    const warehouseByName = new Map<string, WarehouseOrmEntity>();
    for (const w of existingWarehouses) {
      warehouseById.set(w.id, w);
      warehouseByName.set(this.normalizeText(w.name), w);
    }

    const rowsResult: BulkStockImportItemValidation[] = [];
    const seenProductWarehouseCombo = new Map<string, number>();

    let validCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;
    let skippedCount = 0;

    for (const row of rawRows) {
      const cleanName = row.rawProductName.trim();
      const cleanWarehouse = row.rawWarehouse.trim();
      const cleanBatch = row.rawBatchNumber.trim();
      const cleanDate = row.rawEntryDate.trim() || new Date().toISOString().slice(0, 10);

      // Si la cantidad es 0 o menor y no especificó cantidad, se omite limpiamente
      if (row.rawQuantity <= 0) {
        skippedCount++;
        rowsResult.push({
          rowNumber: row.rowNumber,
          productId: row.rawProductId,
          productName: cleanName || `Fila ${row.rowNumber}`,
          uomSymbol: 'UND',
          warehouseName: cleanWarehouse,
          quantity: 0,
          unitCost: row.rawUnitCost,
          totalCost: 0,
          batchNumber: cleanBatch || null,
          entryDate: cleanDate,
          status: 'SKIPPED',
          errors: [],
          warnings: ['Fila omitida por cantidad cero o en blanco'],
          resolvedProductId: null,
          resolvedWarehouseId: null,
        });
        continue;
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      let isDuplicate = false;

      // 1. Verificación obligatoria de existencia del artículo en catálogo
      let matchedProduct: any = null;
      if (row.rawProductId && productById.has(row.rawProductId)) {
        matchedProduct = productById.get(row.rawProductId);
      } else if (cleanName) {
        matchedProduct = productByName.get(this.normalizeText(cleanName));
      }

      let resolvedProductId: string | null = null;
      let uomSymbol = 'UND';
      let resolvedProductName = cleanName;

      if (!matchedProduct) {
        errors.push(
          `El artículo "${cleanName}" no existe en el catálogo. Registre primero el producto en el catálogo antes de cargar existencias.`,
        );
      } else {
        resolvedProductId = matchedProduct.id;
        resolvedProductName = matchedProduct.name;
        uomSymbol = matchedProduct.uom?.code || matchedProduct.uom?.name || 'UND';

        if (matchedProduct.type === ProductType.SERVICE || matchedProduct.manageInventory === false) {
          errors.push(
            `El artículo "${matchedProduct.name}" está catalogado como Servicio o no gestiona inventario.`,
          );
        }
      }

      // 2. Verificación de existencia del almacén
      let matchedWarehouse: WarehouseOrmEntity | null = null;
      if (cleanWarehouse) {
        matchedWarehouse =
          warehouseByName.get(this.normalizeText(cleanWarehouse)) ||
          warehouseById.get(cleanWarehouse) ||
          null;
      }

      let resolvedWarehouseId: string | null = null;
      let resolvedWarehouseName = cleanWarehouse;

      if (!cleanWarehouse) {
        errors.push('El almacén de destino es obligatorio');
      } else if (!matchedWarehouse) {
        errors.push(
          `El almacén "${cleanWarehouse}" no existe en el sistema. Verifique la lista de almacenes disponibles.`,
        );
      } else {
        resolvedWarehouseId = matchedWarehouse.id;
        resolvedWarehouseName = matchedWarehouse.name;
      }

      // 3. Verificación de cantidad y costo
      if (row.rawQuantity <= 0) {
        errors.push('La cantidad inicial debe ser mayor a 0');
      }

      if (row.rawUnitCost < 0) {
        errors.push('El costo unitario no puede ser negativo');
      } else if (row.rawUnitCost === 0) {
        warnings.push('El artículo ingresará con costo unitario de 0.00');
      }

      const totalCost = Number((row.rawQuantity * Math.max(0, row.rawUnitCost)).toFixed(4));

      // 4. Verificación de duplicados en el archivo (mismo producto + mismo almacén + mismo lote)
      if (resolvedProductId && resolvedWarehouseId) {
        const comboKey = `${resolvedProductId}_${resolvedWarehouseId}_${cleanBatch.toLowerCase()}`;
        if (seenProductWarehouseCombo.has(comboKey)) {
          const prevRow = seenProductWarehouseCombo.get(comboKey);
          errors.push(
            `Registro duplicado: ya se incluyó este mismo artículo para el almacén "${resolvedWarehouseName}" en la fila ${prevRow}`,
          );
          isDuplicate = true;
        } else {
          seenProductWarehouseCombo.set(comboKey, row.rowNumber);
        }
      }

      const status = isDuplicate ? 'DUPLICATE' : errors.length === 0 ? 'VALID' : 'INVALID';
      if (status === 'VALID') validCount++;
      else if (status === 'DUPLICATE') duplicateCount++;
      else invalidCount++;

      rowsResult.push({
        rowNumber: row.rowNumber,
        productId: resolvedProductId || row.rawProductId,
        productName: resolvedProductName,
        uomSymbol,
        warehouseName: resolvedWarehouseName,
        quantity: row.rawQuantity,
        unitCost: row.rawUnitCost,
        totalCost,
        batchNumber: cleanBatch || null,
        entryDate: cleanDate,
        status,
        errors,
        warnings,
        resolvedProductId,
        resolvedWarehouseId,
      });
    }

    return {
      totalRows: rowsResult.length,
      validCount,
      duplicateCount,
      invalidCount,
      skippedCount,
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
}
