import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWarehouseAndBatchToMaterialPurchases1791700000000 implements MigrationInterface {
  name = 'AddWarehouseAndBatchToMaterialPurchases1791700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar warehouse_id a material_purchases
    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      ADD COLUMN IF NOT EXISTS "warehouse_id" uuid;
    `);

    // Intentar agregar FK a inventory_warehouses si existe la tabla
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_warehouses'
        ) AND NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_material_purchases_warehouse'
        ) THEN
          ALTER TABLE "material_purchases"
          ADD CONSTRAINT "FK_material_purchases_warehouse"
          FOREIGN KEY ("warehouse_id") REFERENCES "inventory_warehouses"("id") ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_material_purchases_warehouse"
      ON "material_purchases" ("warehouse_id");
    `);

    // 2. Agregar batch_number y expiry_date a material_purchase_items
    await queryRunner.query(`
      ALTER TABLE "material_purchase_items"
      ADD COLUMN IF NOT EXISTS "batch_number" character varying(100),
      ADD COLUMN IF NOT EXISTS "expiry_date" date;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "material_purchase_items"
      DROP COLUMN IF EXISTS "expiry_date",
      DROP COLUMN IF EXISTS "batch_number";
    `);

    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      DROP CONSTRAINT IF EXISTS "FK_material_purchases_warehouse";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_material_purchases_warehouse";
    `);

    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      DROP COLUMN IF EXISTS "warehouse_id";
    `);
  }
}
