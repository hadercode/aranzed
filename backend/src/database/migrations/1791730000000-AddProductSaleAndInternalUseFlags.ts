import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductSaleAndInternalUseFlags1791730000000
  implements MigrationInterface
{
  name = 'AddProductSaleAndInternalUseFlags1791730000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "catalog_products"
      ADD COLUMN IF NOT EXISTS "is_for_sale" boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "is_for_internal_use" boolean NOT NULL DEFAULT false;
    `);

    // Actualizar valores por defecto según el tipo de producto
    // 1. Materia prima (RAW_MATERIAL): Insumo interno para producción, por defecto no se vende directamente en mostrador
    await queryRunner.query(`
      UPDATE "catalog_products"
      SET "is_for_sale" = false,
          "is_for_internal_use" = true,
          "is_active" = true
      WHERE "type" = 'RAW_MATERIAL';
    `);

    // 2. Servicios (SERVICE): Se comercializan y pueden ser usados internamente como mano de obra en recetas
    await queryRunner.query(`
      UPDATE "catalog_products"
      SET "is_for_sale" = true,
          "is_for_internal_use" = true
      WHERE "type" = 'SERVICE';
    `);

    // 3. Producto tradicional (TRADITIONAL) y terminado (FINISHED_GOOD): Para venta directa
    await queryRunner.query(`
      UPDATE "catalog_products"
      SET "is_for_sale" = true,
          "is_for_internal_use" = false
      WHERE "type" IN ('TRADITIONAL', 'FINISHED_GOOD');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "catalog_products"
      DROP COLUMN IF EXISTS "is_for_sale",
      DROP COLUMN IF EXISTS "is_for_internal_use";
    `);
  }
}

