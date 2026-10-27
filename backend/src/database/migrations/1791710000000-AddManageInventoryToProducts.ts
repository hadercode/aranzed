import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManageInventoryToProducts1791710000000 implements MigrationInterface {
  name = 'AddManageInventoryToProducts1791710000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "catalog_products"
      ADD COLUMN IF NOT EXISTS "manage_inventory" boolean NOT NULL DEFAULT true;
    `);

    // Los productos de tipo SERVICE no manejan existencias físicas por defecto
    await queryRunner.query(`
      UPDATE "catalog_products"
      SET "manage_inventory" = false
      WHERE "type" = 'SERVICE';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "catalog_products"
      DROP COLUMN IF EXISTS "manage_inventory";
    `);
  }
}
